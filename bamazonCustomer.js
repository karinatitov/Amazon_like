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
// When connection was made i want all the products to be listed
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showProducts();
});

// in this function i request all the items from bamazonDB products table
// and after i have all the items / i call inquirer
function showProducts() {
    console.log("All the items listed here");

    var query = "SELECT * FROM products";

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
// here i'm asking for id and quantuty of the item
function purchaseItemPrompt() {
    inquirer.prompt([{
            name: "id",
            type: "input",
            message: "Please enter Item ID you like to buy:"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many items would you like to buy?"
        },
    ]).then(function (answers) {
        // i save these values in the variables
        var quantityRequested = answers.quantity;
        var idRequested = answers.id;

        purchaseItem(idRequested, quantityRequested);
    });
}

function purchaseItem(id, quantityNeeded) {
    connection.query("SELECT * from products WHERE item_id = " + id, function (err, response) {
        //  console.log(response)
        if (err) throw error;
        if (quantityNeeded <= response[0].stock_quantity) {

            var totalPrice = response[0].price * quantityNeeded;
            var itemsLeft = response[0].stock_quantity - quantityNeeded;
            console.log("We have your order ready!");
            console.log("Quantity : " + quantityNeeded, "\nProduct name: " + response[0].product_name, "\nYour total: $" + totalPrice);
// Updating my MySQL
            connection.query("UPDATE Products SET ? WHERE ?", [{
                stock_quantity: itemsLeft
            }, {
                item_id: id
            }], function (err, res) {
                if (err) throw err; // Error Handler
            });;
        } else {
// If requested quantity greater than stock quantity
            console.log("Insufficient quantity!");
            console.log("------------------------------------");
        };

        showProducts();
    });
};