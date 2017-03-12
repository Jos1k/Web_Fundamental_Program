const data = [
    "Ada", "Java", "JavaScript", "Brainfuck",
    "LOLCODE", "Node.js", "Ruby on Rails"
];

DataRepository = {
    find: (inputData) => {
        return data.filter((value) => {
            return value.toUpperCase().includes(inputData.toUpperCase())
        });
    }
}

module.exports = DataRepository;