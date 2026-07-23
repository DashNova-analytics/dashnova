import { ObjectId } from "mongodb";

export function mapDocument(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export function mapDocuments(docs) {
  return docs.map(mapDocument);
}

export function toObjectId(id) {
  return typeof id === "string" ? new ObjectId(id) : id;
}
