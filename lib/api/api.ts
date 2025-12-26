import { Note } from "../../types/note";
import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export interface NoteServiceType {
  notes: Note[];
  totalPages: number;
}

export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});
