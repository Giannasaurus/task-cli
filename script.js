const readline = require('readline')
const process = require('process')
const fs = require('fs')

console.log("task-cli")
const prompt = readline.createInterface(process.stdin, process.stdout)
prompt.question(`list | add\n`, async (args) => {
    let tasks = []

    try {
        const data = fs.readFileSync("data/tasks.json", "utf8")
        tasks = JSON.parse(data)
    } catch (err) {
        tasks = []
    }

    if (args === "list") {
        console.log(tasks)
    }

    if (args.includes("add")) {
        const parts = args.split(" ")
        const command = parts[0]
        let description = parts.slice(1).join(" ")
        description = description.replace(/^["'](.*)["']$/, '$1')

        const newTask = {
            id: tasks.length + 1,
            description: description,
            status: "in-progress"
        }

        tasks.push(newTask)
        fs.writeFileSync("data/tasks.json", JSON.stringify(tasks, null, 2))
    }

    prompt.close()
})