var inquirer = require("inquirer");
var connection=require("./connection");

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to the Bamazon management portal")
    mgmtPrompt();
});

const mgmtPrompt = () => {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }]).then((user) => {
        switch (user.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addStock();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
                console.log("That is not a valid action.");
                mgmtPrompt();
                break;
        }
    })
}

const viewProducts = () => {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(item => {
            console.log(`Item ID: ${item.item_id} | Product Name: ${item.product_name} | Department: ${item.department_name} | Price: $${item.price} | Stock: ${item.stock_quantity}`)
        });
        mgmtPrompt();
    })
}

const viewLow = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
        if (err) throw err;
        res.forEach(item => {
            console.log(`Item ID: ${item.item_id} | Product Name: ${item.product_name} | Department: ${item.department_name} | Price: $${item.price} | Stock: ${item.stock_quantity}`)
        });
        mgmtPrompt();
    })
}

const addStock = () => {
    let selections = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(item => {
            selections.push(item.product_name)
        })

        inquirer.prompt([{
                type: "list",
                name: "product",
                message: "Which product would you like to add to?",
                choices: selections
            },
            {
                type: "input",
                name: "quantity",
                message: "How many to add?",
            }
        ]).then((user) => {
            connection.query("SELECT * FROM products WHERE product_name=?", [user.product], function (err, res) {
                if (err) throw err;
                if (!res[0]) {
                    console.log("Sorry, that isn't a valid product name.");
                    addStock();
                } else {
                    console.log(`Updating ${res[0].product_name} stock quantity to ${res[0].stock_quantity+user.quantity}...`);
                    updateItem(res[0].item_id, res[0].stock_quantity, (-1 * user.quantity));
                }
            })
        })
    })
};

const addProduct = () => {
    inquirer.prompt([{
            type: "input",
            name: "product",
            message: "What product would you like to add?",
        },
        {
            type: "input",
            name: "department",
            message: "What is the product department?",
        },
        {
            type: "input",
            name: "price",
            message: "What is the product price?",
        },
        {
            type: "input",
            name: "stock",
            message: "What is the product stock quantity?",
        }
    ]).then((user) => {
        connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (UUID(), ?, ?, ?, ?)", 
        [user.product,user.department,user.price,user.stock], 
            function (err, res) {
                if (err) throw err;
                console.log(`New product added successfully`);
                viewProducts();
        })
    })
}

const updateItem = (id, stock, qty) => {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id =?", [(stock - qty), id], function (err, res) {
        if (err) throw err;
        console.log("Update complete.")
        viewProducts();
    })
}