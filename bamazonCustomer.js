var inquirer = require("inquirer");
var connection = require("./connection");

connection.connect(function (err) {
    if (err) throw err;
    greet();
});

const greet = () => {
    console.log("Welcome to Bamazon!\nHere's what's for sale today\n------------------------------");
    connection.query("SELECT * FROM products WHERE stock_quantity>0", function (err, res) {
        if (err) throw err;
        res.forEach(item => {
            console.log(`${item.product_name}: $${item.price}, ${item.stock_quantity} in stock`)
        });
        custPrompt();
    });
}

const custPrompt = () => {
    inquirer.prompt([{
            type: "input",
            name: "product",
            message: "Which product would you like to purchase?",
        },
        {
            type: "input",
            name: "quantity",
            message: "How many?",
        }
    ]).then((user) => {
        connection.query("SELECT * FROM products WHERE product_name=?", [user.product], function (err, res) {
            if (err) throw err;
            if (!res[0]) {
                console.log("Sorry, we don't sell that item.");
                custPrompt();
            } else if (user.quantity>res[0].stock_quantity){
                console.log("Sorry, we don't have enough product in stock.")
                custPrompt();
            } else{
                console.log("Your order total is $"+(user.quantity*res[0].price))
                updateItem(res[0].item_id,res[0].stock_quantity,user.quantity)
            }
        })
    })
}

const updateItem = (id,stock,qty) =>{
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id =?", [(stock-qty),id], function (err, res) {
        if (err) throw err;
        console.log("Thank you for your order!")
        greet();
    })
}