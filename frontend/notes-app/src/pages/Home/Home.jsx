import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNoteImg from "../../assets/notebooks5.jpg";
import NotFound from "../../assets/not-found.png";

const Home = () => {
  const [openAddEditModal, setopenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setshowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setuserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setisSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setopenAddEditModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  };

  const showToastMessage = ({ message, type }) => {
    setshowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setshowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setuserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage({
          message: "Note deleted successfully",
          type: "delete",
        });
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setshowToastMsg({
          isShown: true,
          message: error.response.data.message,
        });
      }
    }
  };

  //Search For a Note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes/", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setisSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePinned = async (noteData) => {
    const noteId = noteData._id;
    const newPinnedStatus = !noteData.isPinned;

    try {
      const response = await axiosInstance.put(
        `/update-note-Pinned/${noteId}`,
        {
          isPinned: newPinnedStatus,
        }
      );

      if (response.data && response.data.note) {
        showToastMessage({
          message: newPinnedStatus
            ? "Note pinned successfully"
            : "Note unpinned successfully",
          type: "update",
        });
        getAllNotes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearSearch = () => {
    setisSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onPinNote={() => updatePinned(item)}
                onDelete={() => deleteNote(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NotFound : AddNoteImg}
            message={
              isSearch
                ? "Oops! No Note matching was Found."
                : "Looks like your notebook is empty!"
            }
          />
        )}
      </div>

      <button
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 fixed right-6 bottom-6 sm:right-10 sm:bottom-10 shadow-lg transition-all"
        onClick={() =>
          setopenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          })
        }
      >
        <MdAdd className="text-3xl text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 50,
          },
        }}
        contentLabel=""
        className="max-w-full sm:max-w-xl md:max-w-2xl bg-white rounded-md mx-auto mt-14 p-4 sm:p-6 overflow-auto max-h-[90vh] shadow-lg"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setopenAddEditModal({
              isShown: false,
              type: "add",
              data: null,
            })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
