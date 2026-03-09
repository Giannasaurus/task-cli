const readline = require('readline')
const process = require('process')
const fs = require('fs')

console.log("task-cli")
const prompt = readline.createInterface(process.stdin, process.stdout)
prompt.question(`list | add | update | delete\n`, (args) => {
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
        const list = args === "list"
        const done = parts[1] === "done"
        const todo = parts[1] === "todo"
        const inprogress = parts[1] === "in-progress"
        console.log(list, done, todo, inprogress)

        if (list) console.log(tasks)
        else if (done) filterTasks("done", tasks)
        else if (todo) filterTasks("todo", tasks)
        else if (inprogress) filterTasks("in-progress", tasks)
        else console.error(`Not a valid status.\ndone | todo | in-progress`)
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
        const isValidNumber = Number(id)
        if (!isValidNumber) console.log("Invalid ID.")

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
    else {
        console.log(`Not a valid command.\nlist | add | update | delete`)
    }
    prompt.close()
})

function filterTasks(status, tasks) {
    const filteredTasks = tasks.filter(task => task.status === `${status}`)
    console.log(filteredTasks)
}

function handleConfirmation(message, tasksToSave) {
    fs.writeFileSync("data/tasks.json", JSON.stringify(tasksToSave, null, 2))
    console.log(message)
}