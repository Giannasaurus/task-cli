const readline = require('readline')

let tasks = [{
    id: 1,
    description: "wash the dishes",
    status: "in-progress",
    createdAt: "2026-03-06",
    updatedAt: "2026-03-07"
},
{
    id: 2,
    description: "sweep the floor",
    status: "complete",
    createdAt: "2025-09-15",
    updatedAt: "2025-10-22"
},
]

console.log("task-cli")
const prompt = readline.createInterface(process.stdin, process.stdout)
prompt.question(`list | add\n`, (option, callback) => {
    if (option === "list") {
        console.log(tasks)
    }
    else if (option.includes) {
        let extractedOption = option.slice(0, 3)
        console.log(extractedOption)
        let task = option.slice(4,)
    }
})