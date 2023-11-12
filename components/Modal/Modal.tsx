"use client";

import { FormEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TodoTypeRadio from "../TodoTypeRadio/TodoTypeRadio";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";

function Modal() {
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);
  const [addTask, newTaskInput, setNewTaskInput, newTaskType, image, setImage] =
    useBoardStore((state) => [
      state.addTask,
      state.newTaskInput,
      state.setNewTaskInput,
      state.newTaskType,
      state.image,
      state.setImage,
    ]);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    closeModal();
    addTask(newTaskInput, newTaskType, image);
    // Reseting
    setNewTaskInput("");
    setImage(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" onClose={closeModal} onSubmit={handleSubmit}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a task
                </Dialog.Title>

                <div className="mt-2 mb-2">
                  <input
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    type="text"
                    placeholder="Enter a task here..."
                    className="w-full border-2 p-5  border-gray-200  rounded-md outline-none focus:border-green-500"
                  />
                  <TodoTypeRadio />
                  <div>
                    <button
                      type="button"
                      onClick={() => imageFileRef.current?.click()}
                      className=" w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="w-6 h-6 mr-2 inline-block" />
                      Upload image
                    </button>
                    {image && (
                      <div className=" w-full ">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="Uploaded image"
                          className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                          width={200}
                          height={200}
                          onClick={() => setImage(null)}
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      ref={imageFileRef}
                      hidden
                      onChange={(e) => {
                        if (!e.target.files![0].type.startsWith("image/"))
                          return;
                        setImage(e.target.files![0]);
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    type="submit"
                    disabled={!newTaskInput}
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-200 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
