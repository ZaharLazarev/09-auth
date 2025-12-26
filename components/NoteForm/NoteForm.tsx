"use client";
import css from "./NoteForm.module.css";

import { Note } from "../../types/note";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";
import { CreatedNoteParamsType, createNote } from "@/lib/api/clientApi";

// interface NoteFormProps {
//   onClose: () => void;
// }

// const initialValues: CreatedNoteParamsType = {
//   title: "",
//   content: "",
//   tag: "",
// };

export default function NoteForm() {
  // const validationSchema = Yup.object().shape({
  //   title: Yup.string()
  //     .min(3, "Title is too short")
  //     .max(50, "Title is too long")
  //     .required("Title is required"),
  //   content: Yup.string().max(500, "Content is too long"),
  //   tag: Yup.string()
  //     .oneOf(
  //       ["Todo", "Work", "Personal", "Meeting", "Shopping"],
  //       "Invalid option"
  //     )
  //     .required("Tag is required"),
  // });
  // const fieldId = useId();

  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation<Note, Error, CreatedNoteParamsType>({
    mutationFn: (values) => createNote(values),
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as string;
    mutate(
      {
        title: title,
        content: content,
        tag: tag,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          clearDraft();
          router.push("/notes/filter/all");
        },
        onError: () => {
          toast("Nothing to add");
        },
      }
    );
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft?.tag}
          onChange={handleChange}
        >
          <option value="">--Choose option--</option>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
