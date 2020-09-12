import React, { Component } from "react";

import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

import PropTypes from "prop-types";

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      lengthVerification: false,
      folderVerification: true,
      contentVerification: true,
    };
  }

  static contextType = ApiContext;

  checkLength(name) {
    if (name.length > 0) {
      this.setState({ lengthVerification: true });
    } else {
      this.setState({ lengthVerification: false });
    }
  }

  handleSubmit = (event, folders) => {
    event.preventDefault();
    if (event.target["note-content"].value.length === 0) {
      this.setState({ contentVerification: false });
      return;
    } else if (!this.state.contentVerification)
      this.setState({ contentVerification: true });

    if (
      !folders.find(
        (folder) => folder.id === parseInt(event.target["note-f-id"].value)
      )
    ) {
      this.setState({ folderVerification: false });
      return;
    }

    const note = {
      title: event.target["note-name"].value,
      content: event.target["note-content"].value,
      foler_id: event.target["note-f-id"].value,
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((event) => Promise.reject(event));
        }
        return response.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/folder/${note.folderId}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    return (
      <section>
        <h3>Add a note</h3>
        {this.state.folderVerification
          ? null
          : "You need to assign this note to an existing folder."}
        {this.state.contentVerification
          ? null
          : "You need to add text to the content of this note."}
        <ErrorBoundary>
          <NotefulForm onSubmit={(e) => this.handleSubmit(e, folders)}>
            <div>
              <label htmlFor="note-name-input">Name</label>
              <input
                type="text"
                name="note-name"
                onChange={(e) => this.checkLength(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="note-content-input">Content</label>
              <textarea name="note-content" />
            </div>
            <div>
              <label htmlFor="note-folder-select">Folder</label>
              <select name="note-f-id">
                <option value={null}>...</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {this.state.lengthVerification ? (
                <button type="submit">Add note</button>
              ) : null}
            </div>
          </NotefulForm>
        </ErrorBoundary>
      </section>
    );
  }
}

AddNote.propTypes = {
  history: PropTypes.object.isRequired,
};
