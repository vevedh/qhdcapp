/* eslint-disable no-unused-vars */
const jetpack = require('fs-jetpack')
const path = require('path')
const fs = require('fs');
const express = require('@feathersjs/express')
const exec = require('child-process-promise').exec

exports.Mkdocs = class Mkdocs {
  constructor (options) {

    this.options = options || {};
  }

  setup (app, path) {
    this.app = app
    this.path = path
    this.params = app.params
  }

  async find (params) {
    var userfolder = params.query.user;
    var projetName = params.query.projet;
    var isFirst = false;
    var folderList = [];
    if (userfolder) {
        if (jetpack.exists(`${process.cwd()}/users/${userfolder}`)=='dir') {
          folderList = jetpack.list(`${process.cwd()}/users/${userfolder}`);
        } else {
          isFirst = true;
          // creation d'un dossier modele
          jetpack.dir(`${process.cwd()}/users/${userfolder}/default/site`);
          jetpack.dir(`${process.cwd()}/users/${userfolder}/default/docs`);

          jetpack.write(`${process.cwd()}/users/${userfolder}/default/docs/index.md`,`**CACEM-DRH**
======
 ##Présentation
Cette application à été développée pour permettre au Service RH d'effectuer des modifications
sur les comptes utilisateurs en lien direct avec le système d'information des serveurs de la DSI.`);

          jetpack.write(`${process.cwd()}/users/${userfolder}/default/mkdocs.yml`,`site_name: Documents ${userfolder}

nav:
  - Accueil: index.md

theme:
  name: material
  logo: img/favicon.png
  language: fr
  copyright: Hervé de CHAVIGNY
plugins:
  - search:
      lang: fr`);
          this.app.use(`/docs/${userfolder}`, express.static(`${process.cwd()}/users/${userfolder}/default/site`));

        }
        if (projetName) {
          // creation d'un dossier modele
          isFirst = true;
          jetpack.dir(`${process.cwd()}/users/${userfolder}/${projetName}/site`);
          jetpack.dir(`${process.cwd()}/users/${userfolder}/${projetName}/docs`);

          jetpack.write(`${process.cwd()}/users/${userfolder}/${projetName}/docs/index.md`, `**CACEM-DRH**
======
##Présentation
Cette application à été développée pour permettre au Service RH d'effectuer des modifications
sur les comptes utilisateurs en lien direct avec le système d'information des serveurs de la DSI.`);

          jetpack.write(`${process.cwd()}/users/${userfolder}/${projetName}/mkdocs.yml`, `site_name: Projets ${userfolder}

nav:
  - Accueil: index.md

theme:
  name: material
  logo: img/favicon.png
  language: fr
  copyright: Hervé de CHAVIGNY
plugins:
  - search:
      lang: fr`);
           this.app.use(`/docs/${userfolder}`, express.static(`${process.cwd()}/users/${userfolder}/default/site`));
        }

        folderList = jetpack.list(`${process.cwd()}/users/${userfolder}`);
    }


    return folderList;
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
