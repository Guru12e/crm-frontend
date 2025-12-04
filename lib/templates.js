import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://yklhwtudxqitnsgsbmky.supabase.co'
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbGh3dHVkeHFpdG5zZ3NibWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjgwNDYsImV4cCI6MjA3MDIwNDA0Nn0.LILfWgfJDoQK2IdXyKc1oEEOGun4otJ8lPpkcr7EuS8'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* -------------------------
   Helpers
   ------------------------- */

/**
 * Get the currently authenticated user (cached for the lifetime of the call).
 */
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('supabase.auth.getUser error:', error)
    return null
  }
  return data?.user ?? null
}

/**
 * Convert base64 data URL to File object (browser environment)
 * filename should be a single segment (no slashes)
 */
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * sanitize a filename base (remove unsafe chars)
 */
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\.]/gi, '-')
}

/* -------------------------
   Storage helpers
   ------------------------- */

/**
 * Upload image to Supabase Storage
 *
 * Returns: { publicUrl: string, path: string } or null on failure
 *
 * - base64Image: data URL like "data:image/png;base64,...."
 * - type: 'header' | 'footer' | other label
 * - userId: owner folder segment
 * - bucketName: optional (default 'quote-template-images')
 */
export async function uploadTemplateImage(
  base64Image,
  type,
  userId,
  bucketName = 'quote-template-images'
) {
  if (!base64Image || !base64Image.startsWith('data:image')) {
    return null
  }

  try {
    // derive mime & ext
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/png'
    const ext = mime.split('/')[1] || 'png'

    const timestamp = Date.now()
    // safe filename (no slashes)
    const base = sanitizeFilename(`${type}-${timestamp}`)
    const filename = `${base}.${ext}`
    const path = `${userId}/${filename}` // path inside bucket

    const file = dataURLtoFile(base64Image, filename)

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    const { data: publicData, error: urlError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path)

    if (urlError) {
      console.error('getPublicUrl error:', urlError)
      // Not fatal — still return path so callers can request a signed URL if needed
      return { publicUrl: null, path }
    }

    const publicUrl = publicData?.publicUrl ?? null
    return { publicUrl, path }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

/**
 * Delete image from Supabase Storage
 *
 * Accepts either:
 * - storage path (e.g. "userId/header-123.png") OR
 * - publicUrl (e.g. https://.../storage/v1/object/public/bucket/userId/header-123.png)
 *
 * Returns boolean success.
 */
export async function deleteTemplateImage(imageIdentifier, bucketName = 'quote-template-images') {
  if (!imageIdentifier) return true

  try {
    // If looks like a public URL from Supabase storage, parse path after bucket
    let path = imageIdentifier

    try {
      const url = new URL(imageIdentifier)
      // common Supabase public URL shape ends with '/bucketName/<path>'
      // Try to find the bucketName segment in pathname
      const idx = url.pathname.indexOf(`/${bucketName}/`)
      if (idx !== -1) {
        path = url.pathname.slice(idx + (`/${bucketName}/`).length)
      } else {
        // If not found, fallback: attempt to find '/object/public/{bucketName}/' segment
        const altIdx = url.pathname.indexOf(`/object/public/${bucketName}/`)
        if (altIdx !== -1) {
          path = url.pathname.slice(altIdx + (`/object/public/${bucketName}/`).length)
        } else {
          // not a supabase public url - assume caller passed the path already
          path = imageIdentifier
        }
      }
    } catch (e) {
      // not a url; assume its a path already
      path = imageIdentifier
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

/* -------------------------
   Template CRUD (DB)
   ------------------------- */

/**
 * Save template to Supabase
 *
 * Writes both image URL and image path to DB: header_image_url, header_image_path, footer_image_url, footer_image_path
 * Make sure your table has *_path columns (text) to store these.
 */
export async function saveTemplate(templateData, templateName = 'Untitled Template') {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error('User not authenticated')
      return null
    }
    const userId = user.id

    let header_image_url = null
    let header_image_path = null
    if (templateData.headerImage && templateData.headerImage.startsWith('data:image')) {
      const uploaded = await uploadTemplateImage(templateData.headerImage, 'header', userId)
      if (uploaded) {
        header_image_url = uploaded.publicUrl
        header_image_path = uploaded.path
      }
    }

    let footer_image_url = null
    let footer_image_path = null
    if (templateData.footerImage && templateData.footerImage.startsWith('data:image')) {
      const uploaded = await uploadTemplateImage(templateData.footerImage, 'footer', userId)
      if (uploaded) {
        footer_image_url = uploaded.publicUrl
        footer_image_path = uploaded.path
      }
    }

    const { headerImage, footerImage, ...restData } = templateData

    const { data, error } = await supabase
      .from('quote_templates')
      .insert({
        user_id: userId,
        name: templateName,
        header_image_url,
        header_image_path,
        footer_image_url,
        footer_image_path,
        template_data: restData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error saving template:', error)
    return null
  }
}

/**
 * Update existing template
 *
 * If image fields are base64, treat as new upload. If empty string/null, delete existing image.
 * Expects existing DB to have header_image_path/footer_image_path to allow deletion.
 */
export async function updateTemplate(templateId, templateData, templateName) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error('User not authenticated')
      return null
    }
    const userId = user.id

    const { data: existingTemplate, error: existingErr } = await supabase
      .from('quote_templates')
      .select('header_image_url, header_image_path, footer_image_url, footer_image_path')
      .eq('id', templateId)
      .single()

    if (existingErr) {
      console.error('Error fetching existing template:', existingErr)
      throw existingErr
    }

    let header_image_url = existingTemplate?.header_image_url ?? null
    let header_image_path = existingTemplate?.header_image_path ?? null
    let footer_image_url = existingTemplate?.footer_image_url ?? null
    let footer_image_path = existingTemplate?.footer_image_path ?? null

    // Header image handling
    if (templateData.headerImage && templateData.headerImage.startsWith('data:image')) {
      // new image uploaded
      if (header_image_path) {
        await deleteTemplateImage(header_image_path)
      }
      const uploaded = await uploadTemplateImage(templateData.headerImage, 'header', userId)
      if (uploaded) {
        header_image_url = uploaded.publicUrl
        header_image_path = uploaded.path
      } else {
        header_image_url = null
        header_image_path = null
      }
    } else if (!templateData.headerImage && header_image_path) {
      // image was removed in UI -> delete from storage
      await deleteTemplateImage(header_image_path)
      header_image_url = null
      header_image_path = null
    }

    // Footer image handling
    if (templateData.footerImage && templateData.footerImage.startsWith('data:image')) {
      if (footer_image_path) {
        await deleteTemplateImage(footer_image_path)
      }
      const uploaded = await uploadTemplateImage(templateData.footerImage, 'footer', userId)
      if (uploaded) {
        footer_image_url = uploaded.publicUrl
        footer_image_path = uploaded.path
      } else {
        footer_image_url = null
        footer_image_path = null
      }
    } else if (!templateData.footerImage && footer_image_path) {
      await deleteTemplateImage(footer_image_path)
      footer_image_url = null
      footer_image_path = null
    }

    const { headerImage, footerImage, ...restData } = templateData

    const { data, error } = await supabase
      .from('quote_templates')
      .update({
        name: templateName,
        header_image_url,
        header_image_path,
        footer_image_url,
        footer_image_path,
        template_data: restData,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single()

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating template:', error)
    return null
  }
}

/* -------------------------
   Read/Delete helpers
   ------------------------- */

export async function getTemplates() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error('User not authenticated')
      return []
    }

    const { data, error } = await supabase
      .from('quote_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error getting templates:', error)
    return []
  }
}

export async function getTemplate(templateId) {
  try {
    const { data, error } = await supabase
      .from('quote_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (error) {
      console.error('Error fetching template:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting template:', error)
    return null
  }
}

export async function deleteTemplate(templateId) {
  try {
    const template = await getTemplate(templateId)
    if (!template) return false

    // prefer deleting by stored path
    if (template.header_image_path) {
      await deleteTemplateImage(template.header_image_path)
    } else if (template.header_image_url) {
      await deleteTemplateImage(template.header_image_url)
    }

    if (template.footer_image_path) {
      await deleteTemplateImage(template.footer_image_path)
    } else if (template.footer_image_url) {
      await deleteTemplateImage(template.footer_image_url)
    }

    const { error } = await supabase
      .from('quote_templates')
      .delete()
      .eq('id', templateId)

    if (error) {
      console.error('Error deleting template from DB:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error deleting template:', error)
    return false
  }
}

/**
 * Convert template from database for editing (backwards-compatible)
 */
export function prepareTemplateForEditing(template) {
  return {
    ...template.template_data,
    headerImage: template.header_image_url || '',
    footerImage: template.footer_image_url || ''
  }
}
