import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

import PropTypes from "prop-types";

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      folderVerification: false,
    };
  }
  static contextType = ApiContext;

  handleSubmit = (event) => {
    event.preventDefault();

    if (event.target["folder-name"].value.length === 0) {
      this.setState({ folderVerification: true });
      return;
    }

    const folder = {
      title: event.target["folder-name"].value,
    };

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(folder),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((event) => Promise.reject(event));
        }
        return response.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/folder/${folder.id}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    return (
      <section>
        <h3>Add a Folder</h3>
        {this.state.folderVerification ? "Add a name to your folder!" : null}
        <ErrorBoundary>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="folder-name-input">Name</label>
              <input type="text" name="folder-name" />
            </div>
            <div>
              <button type="submit">Create</button>
            </div>
          </NotefulForm>
        </ErrorBoundary>
      </section>
    );
  }
}

AddFolder.propTypes = {
  history: PropTypes.object.isRequired,
};
