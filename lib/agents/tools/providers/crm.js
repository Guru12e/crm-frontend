import { fetchCRM, postCRM } from "../../../utils/crmClient";

export async function assignOwner({ leadId, ownerId }) {
  if (!leadId || !ownerId) throw new Error("Missing leadId/ownerId");
  return postCRM(`/api/leads/${leadId}/assign`, { ownerId });
}

export async function createTask({ assigneeId, title, dueAt, metadata }) {
  if (!assigneeId || !title) throw new Error("Missing assigneeId/title");
  return postCRM(`/api/tasks`, { assigneeId, title, dueAt, metadata });
}

export async function updateCRMField({ entity, id, field, value }) {
  if (!entity || !id || !field) throw new Error("Missing entity/id/field");
  return postCRM(`/api/${entity}/${id}`, { [field]: value });
}


