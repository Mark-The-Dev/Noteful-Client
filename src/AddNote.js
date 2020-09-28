import React from 'react'
import ApiContext from './ApiContext'
import config from './config'


class AddNote extends React.Component {
  state = { 
    name:'',
    folderId:'',
    content:'',
    modified:''
   }

  static contextType = ApiContext;

  generateFolderList = () => {
    const folderList = this.context.folders.map(item => {
      return <option key={item.id} value={item.id}>{item.name}</option>
    })
    return folderList
  }

  handleClickAddNote = (name, description, folder) => {
    let newItem = JSON.stringify({
      name: name,
      folderId: folder || document.getElementById('add-folder').value,
      content: description,
    })
    let error;

    if(name.length >= 3 && description.length >= 3){
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: newItem
    })
    .then(res => {
      if (!res.ok){
        error = { code: res.status };
      }
      return res.json();
    })
    .then(note => {
      if (error) {
        error.message = note.message;
        return Promise.reject(error);
      }
      this.context.addNoteToState(note)
      this.props.history.push(`/`)
    })
    .catch(error => {
      console.error({error});
    });
  } else {
    alert('Please use at least 3 characters for name and description')
  }
    
  }

  getName = (name) => {
    this.setState({
      name:name
    })

  }

  getFolder = (folder) => {
    this.setState({
      folderId: folder
    })

  }
  getContent = (content) => {
    this.setState({
      content: content
    })

  }




  render() { 
    

    return (

      <form>
        <label htmlFor="add-folder">Add Folder</label>
        <select id="add-folder"
        onChange={(e) => this.getFolder(e.target.value)}
        >{this.generateFolderList()}</select>
        <label htmlFor="note-name">Note Name</label>
        <input 
          id="note-name"
          onChange={(e) => this.getName(e.target.value)}
        >
        </input>
        <label htmlFor="add-description">Add Description</label>
        <textarea name="add-description" id="add-description" cols="30" rows="10"
        onChange={(e) => this.getContent(e.target.value)}
        ></textarea>
        <button type="button" onClick={()=> this.handleClickAddNote(this.state.name, this.state.content, this.state.folderId)}>Add Note</button>
      </form>

      );
  }
}
 
export default AddNote;