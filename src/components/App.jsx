import React, { Component } from 'react';
import { nanoid } from 'nanoid'
import { ContactForm } from './ContactForm';
import { Filter } from './Filter';
import { ContactList } from './ContactList';
import Container from './Container.js';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  LS_KEY = 'contacts'

  //method for component FIlter
  filterChange = (event) => {
    const { name, value } = event.currentTarget
    this.setState({
      [name]: value,
    })
  }

  componentDidMount() {
    this.setState({ contacts: this.getDataFromLS() })
  }

  //method for component ContactList
  getFiltredList = () => {
    const { contacts, filter } = this.state

    if (filter) {
      const subString = filter.toLocaleUpperCase();
      const key = isNaN(+filter.charAt(0)) ? 'name' : 'number'
      return contacts.filter(el => el[key].toLocaleUpperCase().includes(subString));
    } else {
      return contacts;
    }
  }

  //general method
  showMessage = (msg) => {
    Notify.warning(msg)
  }

  //check and add new contact
  onAddContact = (newContact) => {
    const { contacts } = this.state

    //check contacts 
    const isExist = Object.keys(newContact).find(key => {
      const subString = newContact[key].toLocaleUpperCase();
      const contact = contacts.find(el => el[key].toLocaleUpperCase().includes(subString));
      if (contact) return !this.showMessage(`${contact[key]} is already in contacts`);
      else return false
    })

    if (isExist) return true;

    //continue
    newContact.id = nanoid(10)
    this.setState(preState => {
      const contacts = [...preState.contacts, newContact]
      this.updateLS(contacts)
      return { contacts }
    })
  }

  //remove contact by id, method for component ContactList
  removeContact = (id) => {
    const { contacts } = this.state
    const updatedContacts = contacts.filter(contact => contact.id !== id);

    this.updateLS(updatedContacts)

    this.setState({
      contacts: updatedContacts,
    })
  }

  //use it when add or delete contact
  updateLS = (contacts) => {
    localStorage.setItem(this.LS_KEY, JSON.stringify(contacts))
  }

  //us it only for componentDidMount
  getDataFromLS() {
    return JSON.parse(localStorage.getItem(this.LS_KEY) || '[]')
  }

  render() {
    const listToRender = this.getFiltredList();

    return (
      <Container>
        <div>
          <ContactForm onAddContact={this.onAddContact} showMessage={this.showMessage} />
        </div>
        <div>
          <Filter value={this.state.filter} onFilterChange={this.filterChange} />
          <ContactList listToRender={listToRender} onRemoveContact={this.removeContact} />
        </div>
      </Container>
    );
  }
};
