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

    if (args.includes("list")) {
        const parts = args.split(" ")
        if (parts[1] === "done") {
            const doneTasks = tasks.filter(task => task.status === "done")
            console.log(doneTasks)
        }
        else if (parts[1] === "todo") {
            const todoTasks = tasks.filter(task => task.status === "todo")
            console.log(todoTasks)
        }
        else if (parts[1] === "in-progress") {
            const inprogressTasks = tasks.filter(task => task.status === "in-progress")
            console.log(inprogressTasks)
        }
        else {
            console.log(tasks)
        }
    }
    else if (args.includes("add")) {
        const parts = args.split(" ")
        let description = parts.slice(1).join(" ")
        description = description.replace(/^["'](.*)["']$/, '$1')

        const newTask = {
            id: tasks.length + 1,
            description: description,
            status: "todo"
        }

        tasks.push(newTask)
        fs.writeFileSync("data/tasks.json", JSON.stringify(tasks, null, 2))
        console.log(`Task added successfully (ID: ${newTask.id})`)
    }
    else if (args.includes("update")) {
        const parts = args.split(" ")
        let newDescription = parts.slice(2).join(" ")
        newDescription = newDescription.replace(/^["'](.*)["']$/, '$1')
        const id = parts[1]
        let updateTask = tasks.find(task => task.id === parseInt(id))
        
        if (updateTask) {
            updateTask.description = newDescription
        }
        
        fs.writeFileSync("data/tasks.json", JSON.stringify(tasks, null, 2))
        console.log(`Task updated successfully (ID: ${id})`)
    }
    else if (args.includes("delete")) {
        const parts = args.split(" ")
        const id = parts[1]
        let deleteTask = tasks.find(task => task.id === parseInt(id))
        let indToRemove = tasks.indexOf(deleteTask, 1)
        tasks.splice(indToRemove, 1)
        fs.writeFileSync("data/tasks.json", JSON.stringify(tasks, null, 2))
        console.log(`Deleted task: ${deleteTask.description} of ID: ${id}`)
    }
    else {
        console.log("Not a valid command.")
    }
    prompt.close()
})