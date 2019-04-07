module.exports = class Server {
  setModules (modules) {
    this.modules = modules
  }
  async createPage () {
    const page = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
  <style>
.bs-callout {
    margin: 0px 0;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 3px;
}
.bs-callout h4 {
    margin-top: 0;
    margin-bottom: 5px;
}
.bs-callout p:last-child {
    margin-bottom: 0;
}
.bs-callout+.bs-callout {
    margin-top: -5px;
}
.bs-callout-warning {
    border-left-color: #f0ad4e;
}
.bs-callout-warning h4 {
    color: #f0ad4e;
}
  </style>
</head>
<body style="background: #EFEFEF">

  <div class="container" class="p-3">
    <div class="p-3">
      <h1> Help: </h1>
      <hr/>      
      ${this.createSections()}      
    </div>
  </div>
  
</body>
</html>
`
    return page
  }

  createSections () {
    const sections = Object.keys(this.modules).map(key => {
      return this.createBody(this.modules[key])
    })

    return sections.join('')
  }
  createBody (modules) {
    const cards = []
    const aliases = this.getAliases(modules)

    // Filter out aliases.
    Object.keys(modules)
      .sort()
      .filter(it => {
        return !aliases[it]
      })
      .map(key => {
        // Now build master map.
        try {
          const currentModule = modules[key]
          cards.push(
            this.createCard(
              key,
              currentModule.help(),
              currentModule.aliases(),
              currentModule.getType()
            )
          )
        } catch (e) {
          console.error(e)
        }
      })

    return `<div>${cards.join('')}</div>`
  }

  getAliases (modules) {
    const aliasesMap = {}

    Object.keys(modules).map(it => {
      const aliases = modules[it].aliases() || []
      aliases.map(key => {
        aliasesMap[key] = true
      })
    })

    return aliasesMap
  }

  createCard (title, help, aliases, types) {
    return `
    <div class="card mt-3">
      <div class="card-header bg-info">
        <h1>${title}</h1>
      </div>
      <div class="card-body">
        <h4>Usage:</h4>
        ${help}
        
        ${this.createAliasesSection('Aliases', aliases)}
        ${this.createAliasesSection(
    'Type',
    Array.isArray(types) ? types : [types]
  )}
      </div>
    </div>
    `
  }

  createAliasesSection (title, items) {
    if (!items || !items.length) {
      return '<div></div>'
    }

    const divs = items.map(it => {
      return `<div class="list-group-item list-group-item-action" style="border-radius: 0px">${it}</div>`
    })

    return `
    <div class="mt-3">
      <h4>${title}:</h4>
      <div class="list-group bs-callout bs-callout-warning" style="display: inline-block;">
        ${divs.join('')}
      </div>
    </div>
    `
  }
}
