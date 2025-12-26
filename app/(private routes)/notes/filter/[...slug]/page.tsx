import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";

interface NotesProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const tag = (await params).slug?.[0];
  return {
    title: `${tag}`,
    description: `The param of filter is ${tag}`,
    openGraph: {
      title: `${tag}`,
      description: `The param of filter is ${tag}`,
      url: `https://08-zustand-sigma-ashen.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotesByTag({ params }: NotesProps) {
  const tag = (await params).slug?.[0];
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      tag && tag !== "all" ? fetchNotes(1, "", tag) : fetchNotes(1, ""),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient paramTag={tag} />
    </HydrationBoundary>
  );
}
