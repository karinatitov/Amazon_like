// make a connection to mySQL

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    password: "43Aruzap*",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showProducts();
});


function showProducts() {
    console.log("All the items listed here");

    var query = "select * from products";

    connection.query(query, function (err, res) {
        if (err) throw err;
        var displayItems = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Qty"],
            colWidths: [4, 15, 15, 7, 7]
        });
        for (var i = 0; i < res.length; i++) {
            displayItems.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(displayItems.toString());
        purchaseItemPrompt()
    })

}

function purchaseItemPrompt() {
    inquirer.prompt([{
            name: "id",
            type: "input",
            message: "Please enter Item ID you like to buy "
        },
        {
            name: "quantity",
            type: "input",
            message: "How many items would you like to buy?"
        },
    ]).then(function (answers) {
        var quantityOfItems = answers.quantity;
        var requestedID = answers.id;
        // purchaseItem(requestedID, quantityOfItems);
    });
}

