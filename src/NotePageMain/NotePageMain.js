import React from "react";
import Note from "../Note/Note";
import ApiContext from "../ApiContext";
import { findNote } from "../notes-helpers";
import "./NotePageMain.css";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

import PropTypes from "prop-types";

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {},
    },
  };
  static contextType = ApiContext;

  handleDeleteNote = (noteId) => {
    this.props.history.push(`/`);
  };

  render() {
    const { notes = [] } = this.context;
    const noteId = parseInt(this.props.match.params["noteId"]);
    const note = findNote(notes, noteId) || { content: "" };
    return (
      <ErrorBoundary>
        <section className="NotePageMain">
          <Note
            id={note.id}
            name={note.title}
            modified={note.date_published}
            onDeleteNote={this.handleDeleteNote}
          />
          <div className="NotePageMain__content">
            {note.content.split(/\n \r|\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      </ErrorBoundary>
    );
  }
}

NotePageMain.propType = {
  match: PropTypes.object.isRequired,
};
