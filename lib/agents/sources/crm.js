import { fetchCRM } from "../utils/crmClient";

export async function getCrmSnapshot(event) {
  try {
    const id = event?.payload?.id;
    if (!id) return {};
    const entity = inferEntityFromType(event.type);
    const details = await fetchCRM(`/api/${entity}/${id}`);
    return { entity, details };
  } catch (e) {
    return { error: true, message: e?.message };
  }
}

function inferEntityFromType(type) {
  switch (type) {
    case "LeadCreated":
    case "LeadStatusChanged":
      return "leads";
    case "DealLost":
      return "deals";
    default:
      return "leads";
  }
}


