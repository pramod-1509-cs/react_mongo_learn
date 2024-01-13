import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  const API_URL = "http://localhost:5038/";

  useEffect(() => {
    refreshNotes();
  }, []);

  const refreshNotes = async () => {
    try {
      const response = await fetch(API_URL + "api/todoapp/GetNotes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addClick = async () => {
    try {
      const data = new FormData();
      data.append("newNotes", newNote);

      const response = await fetch(API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      alert(result);
      refreshNotes();
      setNewNote(""); // Clear input field after adding a note
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateClick = async () => {
    if (selectedNote === null) {
      alert("Please select a note to update."); 
      return;
    }

    try {
      const data = new FormData();
      data.append("updatedNote", newNote);

      const response = await fetch(
        API_URL + `api/todoapp/UpdateNotes?id=${selectedNote}`,
        {
          method: "PUT",
          body: data,
        }
      );

      const result = await response.json();
      alert(result);
      refreshNotes();
      setNewNote(""); // Clear input field after updating a note
      setSelectedNote(null); // Clear selected note after updating
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteClick = async (id) => {
    try {
      const response = await fetch(API_URL + `api/todoapp/DeleteNotes?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      alert(result);
      refreshNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const selectNote = (id) => {
    setSelectedNote(id);
    const selectedNoteContent = notes.find((note) => note.id === id).desc;
    setNewNote(selectedNoteContent);
  };

  return (
    <div className="App">
      <h2>Todo App</h2>
      <input
        id="newNotes"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      &nbsp;
      <button onClick={addClick}>Add Notes</button>
      &nbsp;
      <button onClick={updateClick}>Update Notes</button>
      {notes.map((note) => (
        <div key={note.id}>
          <p onClick={() => selectNote(note.id)}>{note.desc}</p>&nbsp;
          <button onClick={() => deleteClick(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
