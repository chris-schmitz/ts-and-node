import express from "express"
import sqlite3 from "sqlite3"
import path from "path"

let PORT = 3000
const app = express()
const db = new sqlite3.Database(
  path.join(__dirname, "..", "database", "exploration-database.db"),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (error) => {
    if (error) {
      console.error(
        `There was an error when connecting to the databse: ${error}`
      )
    } else {
      setupDatabase()
    }
  }
)

app.use(express.json())
app.use(express.urlencoded())

app.get("/", (request, response) => {
  response.json({ message: "worked!" })
})

app.get("/pets", (request, response) => {
  db.all("SELECT * FROM pets", (error, rows) => {
    if (error) {
      console.error(error)
      return response.json({
        success: false,
        message: "pet query failed",
        error,
      })
    }
    response.json(rows)
  })
})

app.post("/pet", (request, response) => {
  const name = request.body.name
  const type = request.body.type

  console.log({ name, type })

  db.run(
    "INSERT INTO pets (name, type) VALUES (?,?)",
    [name, type],
    (error: Error) => {
      if (error) {
        console.error(error)
        return response.json({
          success: false,
          message: "pet submission failed",
          error,
        })
      }

      response.json({ success: true, message: "pet submitted sucessfully" })
    }
  )
})

app.listen(3000, () => {
  console.log(` Listening on port: ${PORT}`)
})

function setupDatabase() {
  db.run(
    "CREATE TABLE IF NOT EXISTS pets (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, type STRING)"
  )
}
