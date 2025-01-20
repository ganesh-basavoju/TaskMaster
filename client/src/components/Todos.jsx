import React from "react";
import toast from "react-hot-toast";
import DeleteIcon from "@/icons/DeleteIcon";
import EditTodo from "./EditTodo";
import TickIcon from "@/icons/TickIcon";
import { CircleUserRound, Plus } from "lucide-react";
import useSWR from "swr";
import { Input } from "./ui/input";
import Profile from "./Profile";

const fetcher = (url, options = {}) =>
  fetch(url, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    mode: "cors",
    ...(options.body && { body: JSON.stringify(options.body) }),
  }).then((res) => res.json());

const Todos = () => {
  const { data, error, mutate } = useSWR(
    "http://localhost:3000/api/todos",
    fetcher
  );

  if (error) {
    return <h1 className="text-2xl py-2 text-center">Something went wrong</h1>;
  }

  if (!data) {
    return <h1 className="text-2xl py-2 text-center">Loading...</h1>;
  }

  function handleError(error) {
    toast.error(error);
    throw new Error(error);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");

    if (!title.trim().length) {
      toast.error("Todo can't be empty!");
      return;
    }

    const newTodo = {
      title: `${title} adding...`,
      _id: Date.now().toString(),
      isCompleted: false,
    };

    async function addTodo() {
      const response = await fetcher("http://localhost:3000/api/todos", {
        method: "POST",
        body: { title },
      });
      if (response.error) {
        handleError(response.error);
      }
      return [...data, response];
    }

    await mutate(addTodo, {
      optimisticData: [...data, newTodo],
      revalidate: true,
      rollbackOnError: true,
    });

    e.target.reset();
  }

  async function deleteTodo(id) {
    toast.success("Todo deleted!");
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.filter((todo) => todo._id !== id);
      },
      {
        optimisticData: data.filter((todo) => todo._id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async function handleComplete(id, isCompleted) {
    try {
      await mutate(
        async () => {
          const response = await fetcher(
            `http://localhost:3000/api/todos/${id}`,
            {
              method: "PUT",
              body: { isCompleted: !isCompleted },
            }
          );
          if (response.error) throw new Error(response.error);
          return data.map((todo) =>
            todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
          );
        },
        {
          optimisticData: data.map((todo) =>
            todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
          ),
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch (error) {
      handleError(error.message);
    }
  }

  async function handleUpdate(formData) {
    const title = formData.get("title");
    const id = formData.get("id");

    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "PUT",
            body: { title },
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) =>
          todo._id === id ? { ...todo, title } : todo
        );
      },
      {
        optimisticData: data.map((todo) =>
          todo._id === id ? { ...todo, title } : todo
        ),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-lg px-4 w-full flex flex-col gap-6">
      <div className="flex justify-end">
        <Profile/>
      </div>
      <h1 className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text">
  Todo App
</h1>

      <form onSubmit={handleAddTodo} className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Enter todo"
          name="title"
          id="title"
          required
          aria-label="Enter your todo title"
          className="shadow-md"
        />
        <button
          className="h-9 rounded-md border-input bg-transparent px-4 text-base shadow-md"
          aria-label="Add Todo"
        >
          <Plus
            size={20}
            className="transition ease-linear group-hover:stroke-white"
          />
        </button>
      </form>
      {data.length ? (
        <div className="shadow-md border-2 border-input bg-transparent flex flex-col rounded">
          {data.map((todo, index) => (
            <div
              key={index}
              className={`flex h-10 items-center w-full ${
                index === data.length - 1 ? "border-b-0" : "border-b-2"
              }`}
            >
              <span
                className={`flex-1 px-3 ${
                  todo.isCompleted && "line-through text-[#63657b]"
                }`}
              >
                {todo.title}
              </span>
              <div className="px-3 flex gap-2">
                <TickIcon
                  onClick={() =>
                    handleComplete(todo._id, todo.isCompleted)
                  }
                  className={`mt-1 transition ease-in-out hover:cursor-pointer ${
                    todo.isCompleted ? "text-primary" : "text-slate-300"
                  }`}
                />
                <DeleteIcon
                  className="iconHover"
                  onClick={() => deleteTodo(todo._id)}
                />
                <EditTodo
                  handleUpdate={handleUpdate}
                  id={todo._id}
                  title={todo.title}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>You don't have Todo</span>
      )}
    </div>
  );
};

export default Todos;
