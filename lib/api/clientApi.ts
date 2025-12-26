import { Note } from "@/types/note";
import { nextServer, NoteServiceType } from "./api";
import { User } from "@/types/user";
import { isAxiosError } from "axios";

export interface CreatedNoteParamsType {
  title: string;
  content: string;
  tag: string;
}

export type RegisterParams = {
  email: string;
  password: string;
};
export type LoginParams = {
  email: string;
  password: string;
};
export type UpdateMeParams = {
  username?: string;
  email?: string;
};

export const fetchNotes = async (
  page: number,
  query: string,
  tag?: string
): Promise<NoteServiceType> => {
  const configurations = {
    params: tag
      ? {
          search: query,
          page: page,
          perPage: 12,
          tag: tag,
        }
      : {
          search: query,
          page: page,
          perPage: 12,
        },
  };
  const response = await nextServer.get<NoteServiceType>(
    "/notes",
    configurations
  );
  return response.data;
};

export const fetchNoteById = async (id: Note["id"]) => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  values: CreatedNoteParamsType
): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", values);
  return response.data;
};

export const deleteNote = async (id: Note["id"]): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);

  return response.data;
};

export async function register(payload: RegisterParams) {
  const { data } = await nextServer.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: LoginParams) {
  const { data } = await nextServer.post<User>("/auth/login", payload);
  return data;
}

export async function logout() {
  const { data } = await nextServer.post<{ success: true }>("/auth/logout");
  return data;
}

export async function checkSession(): Promise<boolean> {
  try {
    await nextServer.get("/auth/session");
    return true;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) return false;
    return false;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      return null;
    }
    throw err;
  }
}

export async function updateMe(payload: UpdateMeParams) {
  const { data } = await nextServer.patch<User>("/users/me", payload);
  return data;
}
