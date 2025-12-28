import { Note } from "@/types/note";
import { nextServer, NoteServiceType } from "./api";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { AxiosResponse, isAxiosError } from "axios";

export const fetchNotes = async (
  page: number,
  query: string,
  tag?: string
): Promise<NoteServiceType> => {
  const cookieStore = await cookies();
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
    headers: {
      Cookie: cookieStore.toString(),
    },
  };

  const response = await nextServer.get<NoteServiceType>(
    "/notes",
    configurations
  );
  return response.data;
};

export const fetchNoteById = async (id: Note["id"]) => {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export async function checkSession(): Promise<AxiosResponse | null> {
  const cookieStore = await cookies();

  try {
    return await nextServer.get("/auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      return null;
    }
    throw err;
  }
}

export async function getMe(): Promise<User | null> {
  const cookieStore = await cookies();
  try {
    const { data } = await nextServer.get<User>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      return null;
    }
    throw err;
  }
}
