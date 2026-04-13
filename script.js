const readline = require('readline')
const process = require('process')
const fs = require('fs')

const prompt = readline.createInterface(process.stdin, process.stdout)
prompt.question(`task-cli\nlist | add | update | delete\n`, (args) => {
    let tasks = []

    try {
        const data = fs.readFileSync("data/tasks.json", "utf8")
        tasks = JSON.parse(data)
    }
    catch (err) {
        tasks = []
    }

    const parts = args.split(" ")

    if (parts[0] === "list") {
        let status = null;
        let table = false;
        if (parts[1]) {
            if (parts[1] === "--table") {
                table = true;
                if (parts[2] && (parts[2] === "done" || parts[2] === "todo" || parts[2] === "in-progress")) {
                    status = parts[2];
                }
            } else if (parts[1] === "done" || parts[1] === "todo" || parts[1] === "in-progress") {
                status = parts[1];
                if (parts[2] === "--table") {
                    table = true;
                }
            } else {
                console.error(`Not a valid status.\ndone | todo | in-progress`)
            }
        }
        if (status) {
            filterTasks(status, tasks, table)
        } else {
            if (table) {
                console.table(tasks.map(task => ({ id: task.id, description: task.description, status: task.status })))
            } else {
                console.log("All tasks:")
                tasks.forEach(task => console.log(`${task.id}: ${task.description} [${task.status}]`))
            }
        }
    }
    else if (parts[0] === "add") {
        let description = parts.slice(1).join(" ")
        description = description.replace(/^["'](.*)["']$/, '$1')

        const newTask = {
            id: tasks.length + 1,
            description: description,
            status: "todo",
            createdAt: new Date().toISOString()
        }

        tasks.push(newTask)
        handleConfirmation(`Task added successfully (ID: ${newTask.id})`, tasks)
    }
    else if (parts[0] === "update") {
        const id = parts[1]
        if (isNaN(id) || id <= 0) {
            console.log("Invalid ID.")
            prompt.close()
            return
        }

        let newDescription = parts.slice(2).join(" ")
        newDescription = newDescription.replace(/^["'](.*)["']$/, '$1')
        let taskToUpdate = tasks.find(task => task.id === parseInt(id))

        if (!taskToUpdate) {
            console.error(`Task with ID: ${id} not found.`)
        }
        else if (!newDescription) {
            console.error("Please write something.")
        }
        else {
            taskToUpdate.description = newDescription
            handleConfirmation(`Task updated successfully (ID: ${id})`, tasks)
        }
    }
    else if (parts[0] === "delete") {
        const id = parts[1]
        let taskToDelete = tasks.find(task => task.id === parseInt(id))

        if (!taskToDelete) {
            console.error(`Task with ID: ${id} not found.`)
        } else {
            let indexToRemove = tasks.indexOf(taskToDelete)
            tasks.splice(indexToRemove, 1)
            handleConfirmation(`Deleted task: "${taskToDelete.description}" (ID: ${id})`, tasks)
        }
    }
    else if (parts[0].includes("mark-")) {
        let splitParts = parts[0].split("-")
        let stat = splitParts.slice(1).join("-")
        let id = parts[1]
        let taskToMark = tasks.find(task => task.id === parseInt(id))
        
        if ((stat === "done" || stat === "todo" || stat === "in-progress") && taskToMark) {
            taskToMark.status = stat
            handleConfirmation(`Updated task status to ${taskToMark.status} (ID: ${id})`, tasks)
        }
        else {
            console.log("Invalid status/ID.")
        }
    }
    else if (parts[0] === "help") {
        console.log("list [done | todo | in-progress] [--table]")
        console.log(`add <\"description\">`)
        console.log(`update <id> <\"description\">`)
        console.log("delete <id>")
        console.log("mark-[done | todo | in-progress]")
    }
    else {
        console.log(`Not a valid command.\nlist | add | update | delete`)
    }
    prompt.close()
})

function filterTasks(status, tasks, table = false) {
    const filteredTasks = tasks.filter(task => task.status === status)
    if (table) {
        console.table(filteredTasks.map(task => ({ id: task.id, description: task.description, status: task.status })))
    } else {
        if (filteredTasks.length === 0) {
            console.log(`No tasks with status ${status}`)
        } else {
            console.log(`${status} tasks:`)
            filteredTasks.forEach(task => console.log(`${task.id}: ${task.description}`))
        }
    }
}

function handleConfirmation(message, tasksToSave) {
    fs.writeFileSync("data/tasks.json", JSON.stringify(tasksToSave, null, 2))
    console.log(message)
}