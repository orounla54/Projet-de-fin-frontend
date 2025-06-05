import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import MessagesSidebar from "../partials/messages/MessagesSidebar";
import MessagesHeader from "../partials/messages/MessagesHeader";
import MessagesBody from "../partials/messages/MessagesBody";
import MessagesFooter from "../partials/messages/MessagesFooter";
import { useGetData } from "../utils/Requests/RequestService";
import SpinnerLoading from "../components/SpinnerLoading";
import AddDiscutionTache from "../components/AddDiscutionTache";
import ModalInfosDiscussion from "../components/ModalInfosDiscussion";
import { useSuccessMessage } from "../utils/SuccessContext";
import Toast from "../components/Toast";

function Messages() {
  const { id } = useParams();
  const contentArea = useRef(null);

  const { successMessage, setSuccessMessage } = useSuccessMessage();
  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackModalOpenUpdate, setFeedbackModalOpenUpdate] = useState(false);
  const [msgSidebarOpen, setMsgSidebarOpen] = useState(true);
  const [discussionCurrent, SetDiscussionCurrent] = useState([]);
  const [idDiscussionCurrent, setIdDiscussionCurrent] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [responsableLog, setResponsableLog] = useState();
  const [keyword, setKeyword] = useState("");
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    contentArea.current.scrollTop = msgSidebarOpen ? 0 : 99999999;
  }, [msgSidebarOpen]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(""), 3000); // Effacer le message après 3 secondes
    }
  }, [successMessage]);

  //get messages discussion
  const { data, error, loading, fetchData } = useGetData(
    id ? `messages/discussion/${id}` : ""
  );

  //get responsable log
  const {
    data: responsable,
    error: responsableError,
    loading: responsableLoading,
  } = useGetData("responsables/log");

  //get discussion for log
  const {
    data: DiscussionsData,
    loading: DiscussionsLoading,
    error: DiscussionsError,
    fetchData: fetchDiscussions,
  } = useGetData(`discussions?keyword=${keyword}`);

  //get discussion current
  const {
    data: DiscussionsCurrentData,
    loading: DiscussionsCurrentLoading,
    error: DiscussionsCurrentError,
    fetchData: fetchDiscussionCurrent,
  } = useGetData(id ? `discussions/${parseInt(id)}` : "");

  //get medias discussion current
  const {
    data: mediasDiscussionsCurrentData,
    loading: mediasDiscussionsCurrentLoading,
    error: mediasDiscussionsCurrentError,
    fetchData: mediasFetchDiscussionCurrent,
  } = useGetData(id ? `mediaDiscu/${parseInt(id)}` : "");

  useEffect(() => {
    if (responsable) {
      setResponsableLog(responsable);
    }
    // console.log(responsableLog);
  }, [responsable]);

  useEffect(() => {
    if (DiscussionsData) {
      setDiscussions(DiscussionsData);
    }
    console.log(discussions);
  }, [DiscussionsData]);

  useEffect(() => {
    if (DiscussionsCurrentData) {
      setIdDiscussionCurrent(DiscussionsCurrentData.id);
      SetDiscussionCurrent(DiscussionsCurrentData);
    }
    // console.log(discussionCurrent);
    // console.log(idDiscussionCurrent);
  }, [DiscussionsCurrentData, id]);

  useEffect(() => {
    if (mediasDiscussionsCurrentData) {
      const parsedMedia = mediasDiscussionsCurrentData.map((media) => {
        if (media.responsable && typeof media.responsable === "string") {
          try {
            media.responsable = JSON.parse(media.responsable);
          } catch (error) {
            console.error("Erreur lors de la conversion JSON :", error);
          }
        }
        return media;
      });
      setMedias(parsedMedia);
    }
    // console.log(medias);
  }, [mediasDiscussionsCurrentData, id]);

  useEffect(() => {
    if (data) {
      const parsedMessages = data.map((message) => {
        if (message.responsable && typeof message.responsable === "string") {
          try {
            message.responsable = JSON.parse(message.responsable);
          } catch (error) {
            console.error("Erreur lors de la conversion JSON :", error);
          }
        }
        return message;
      });
      // console.log(parsedMessages);
      setMessages(parsedMessages);
    }
  }, [data, discussionCurrent]);

  const isLoading = DiscussionsLoading || DiscussionsCurrentLoading;

  useEffect(() => {
    if (isLoading) {
      // Désactiver le scroll
      document.body.classList.add("overflow-hidden");
    } else {
      // Réactiver le scroll
      document.body.classList.remove("overflow-hidden");
    }

    // Nettoyage au démontage
    return () => document.body.classList.remove("overflow-hidden");
  }, [isLoading]);

  const messagesEndRef = useRef(null); // Référence pour le conteneur des messages

  useEffect(() => {
    // Faire défiler jusqu'à la fin des messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Déclencher uniquement lorsque les messages changent

  return (
    <div className="flex h-[100dvh] overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        variant="v2"
      />

      {/* Content area */}
      <div
        className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto"
        ref={contentArea}
      >
        {/* Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          variant="v2"
        />

        <main className={`grow relative`}>
          {DiscussionsLoading ||
          DiscussionsCurrentLoading ||
          loading ||
          mediasDiscussionsCurrentLoading ? (
            <div className="absolute z-40 flex items-center justify-center w-full h-full bg-white dark:bg-gray-900">
              <SpinnerLoading />
            </div>
          ) : (
            <>
              {successMessage && (
                <div className="absolute left-08 bottom-8 z-60 ">
                  <Toast
                    type="success"
                    open={toastSuccessOpen}
                    setOpen={setToastSuccessOpen}
                  >
                    {successMessage}
                  </Toast>
                </div>
              )}
              <div className={`flex h-full`}>
                {/* Messages sidebar */}
                <MessagesSidebar
                  discussions={discussions}
                  idDiscussionCurrent={idDiscussionCurrent}
                  msgSidebarOpen={msgSidebarOpen}
                  setMsgSidebarOpen={setMsgSidebarOpen}
                  DiscussionsError={DiscussionsError}
                  setKeyword={setKeyword}
                  setFeedbackModalOpen={setFeedbackModalOpen}
                  fetchDiscussions={fetchDiscussions}
                />
                <AddDiscutionTache
                  feedbackModalOpen={feedbackModalOpen}
                  setFeedbackModalOpen={setFeedbackModalOpen}
                  fetchData={fetchDiscussions}
                />

                {/* Discussioncurrent update */}
                <AddDiscutionTache
                  feedbackModalOpen={feedbackModalOpenUpdate}
                  setFeedbackModalOpen={setFeedbackModalOpenUpdate}
                  fetchData={() => {
                    fetchDiscussionCurrent();
                    fetchDiscussions();
                  }}
                  discussion={discussionCurrent}
                  tache={{ id: discussionCurrent?.idTache }}
                />

                {/* Discussioncurrent info */}
                <div className="absolute z-60">
                  <ModalInfosDiscussion
                    newsModalOpen={newsModalOpen}
                    discussion={discussionCurrent}
                    setNewsModalOpen={setNewsModalOpen}
                    medias={medias}
                    fetchData={() => {
                      fetchDiscussionCurrent();
                      fetchDiscussions();
                      mediasFetchDiscussionCurrent();
                    }}
                  />
                </div>
                <div
                  className={`grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${
                    msgSidebarOpen ? "translate-x-1/3" : "translate-x-0"
                  }`}
                >
                  <MessagesHeader
                    responsableLog={responsableLog}
                    msgSidebarOpen={msgSidebarOpen}
                    setMsgSidebarOpen={setMsgSidebarOpen}
                    fetchDiscussionCurrent={fetchDiscussionCurrent}
                    discussionCurrent={discussionCurrent}
                    fetchDiscussions={fetchDiscussions}
                    setNewsModalOpen={setNewsModalOpen}
                    setFeedbackModalOpen={setFeedbackModalOpenUpdate}
                  />

                  {/* Messages body */}
                  <MessagesBody
                    DiscussionsCurrentError={DiscussionsCurrentError}
                    discussionCurrent={discussionCurrent}
                    idDiscussionCurrent={idDiscussionCurrent}
                    responsableLog={responsableLog}
                    messages={messages}
                    medias={medias}
                    error={error}
                    loading={loading}
                    data={data}
                    fetchData={() => {
                      fetchDiscussionCurrent();
                      fetchDiscussions();
                      mediasFetchDiscussionCurrent();
                      fetchData();
                    }}
                  />
                  <div ref={messagesEndRef} />

                  <MessagesFooter
                    discussionCurrent={discussionCurrent}
                    responsableLog={responsableLog}
                    fetchData={() => {
                      fetchDiscussionCurrent();
                      fetchDiscussions();
                      mediasFetchDiscussionCurrent();
                      fetchData();
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Messages;
