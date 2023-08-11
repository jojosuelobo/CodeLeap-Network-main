/// <reference types="cypress" />
import { LoremIpsum } from "lorem-ipsum";
const data = require('../../fixtures/data.json')

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 10,
      min: 4
    },
})

const username = ( data.username + Math.floor(Math.random() * (999 - 1) + 1) )
const title = lorem.generateWords(1)
const content = lorem.generateSentences(1)
const newTitle = lorem.generateWords(1)
const newContent = lorem.generateSentences(1)

beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.contains('Welcome to CodeLeap network!')
});

context('application test', () => {
    it('user flow test', () => {
        // Create register with a random usernme 
        cy.get('[name="username"]').type(username)
        cy.get('button').click()
        cy.contains('CodeLeap Network')
        // Insert a lorem title
        cy.get('[name="title"]').type(title)
        // Insert a lorem content
        cy.get('[name="content"]').type(content)
        cy.contains('CREATE').click()

        // Validates if the content match
        cy.get('section').find('div').first().as('created-register').contains(username)
        cy.get('@created-register').contains(title)
        cy.get('@created-register').contains(content)

        // Edit the register
        cy.get('section').find('div').first().contains(title).next().first('button').click()
        cy.get('[d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"]').as('edit').click({force: true})
        cy.contains('Edit item').should('be.visible')
        cy.get('.ReactModal__Content').find('[name="title"]').clear().type(newTitle)
        cy.get('.ReactModal__Content').find('[name="content"]').clear().type(newContent)
        cy.contains('SAVE').click()
        cy.contains('Item was successfully updated.').should('be.visible')
        // Validates the edited register
        cy.get('section').find('div').first().as('created-register').contains(username)
        cy.get('@created-register').contains(newTitle)
        cy.get('@created-register').contains(newContent)

        // Delete the register
        cy.get('section').find('div').first().contains(newTitle).next().first('button').click()
        cy.get('[d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]').as('delete').click( {force: true} )
        cy.contains('Are you sure you want to delete this item?').should('be.visible')
        cy.contains('OK').click()
        cy.contains('Item was successfully deleted.').should('be.visible')

        // Logout
        cy.get('[d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"]').as('logout').click({force: true})
        cy.contains('Welcome to CodeLeap network!')
    });
});