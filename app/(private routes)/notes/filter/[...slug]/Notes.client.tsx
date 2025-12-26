"use client";

import css from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { TailSpin } from "react-loader-spinner";
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";

interface NotesClientProps {
  paramTag?: string;
}

export default function NotesClient({ paramTag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [query, setNewQuery] = useState("");
  // const [isModalOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["notes", page, query, paramTag],
    queryFn: () =>
      paramTag && paramTag !== "all"
        ? fetchNotes(page, query, paramTag)
        : fetchNotes(page, query),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  const updateQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewQuery(e.target.value);
      setPage(1);
    },
    600
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox updateQuery={updateQuery} />
        {totalPages > 1 && (
          <Pagination setPage={setPage} page={page} totalPages={totalPages} />
        )}
        <Link href={"/notes/action/create"} className={css.button}>
          Create note +
        </Link>
      </header>
      {data && !isLoading && <NoteList notes={data.notes} />}
      {isLoading && <TailSpin />}
    </div>
  );
}
