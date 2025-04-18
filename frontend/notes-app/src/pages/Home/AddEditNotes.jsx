import React, { useState } from "react";
import TagInput from "../../components/Navbar/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  getAllNotes,
  showToastMessage,
}) => {
  const [title, settitle] = useState(noteData?.title || "");
  const [content, setcontent] = useState(noteData?.content || "");
  const [tags, settags] = useState(noteData?.tags || []);

  const [error, seterror] = useState(null);

  //Add Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage({
          message: "Note added successfully",
          type: "add",
        });
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterror(error.response.data.message);
      }
    }
  };

  //Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage({
          message: "Note updated successfully",
          type: "edit",
        });
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterror(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      seterror("Please enter the title");
      return;
    }

    if (!content) {
      seterror("Please enter the content");
      return;
    }

    seterror("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white rounded shadow-md">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-200 cursor-pointer"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-500" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-base font-medium">Title</label>
        <input
          type="text"
          className="text-lg sm:text-xl text-slate-900 outline-none border border-slate-300 rounded px-3 py-2"
          placeholder="Enter your title"
          value={title}
          onChange={({ target }) => settitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-base font-medium">Content</label>
        <textarea
          className="text-sm sm:text-base text-slate-900 outline-none bg-slate-50 border border-slate-300 p-3 rounded resize-none"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setcontent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label text-base font-medium">Tags</label>
        <TagInput tags={tags} settags={settags} />
      </div>

      {error && (
        <span className="text-red-500 text-xs pt-4 block">{error}</span>
      )}

      <button
        className="btn-primary font-medium mt-5 p-3 w-full sm:w-auto rounded transition-all hover:opacity-90"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
