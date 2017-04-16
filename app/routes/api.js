// packages
var User = require('../models/user');
var Inventory = require('../models/inventory');
var History = require('../models/history');
var jwt = require('jsonwebtoken'); // Used to provide session info as cookie in a secured way
var secret = 'ecs193ab'; // Provides extra security to jwt
var cron = require('node-cron');
//sendgrid information to send autonomous emails.
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var fs = require('fs');
var parse = require('csv-parse');
var HashMap = require('hashmap');
var ArrayList = require('arraylist');

Inventory.findAndStreamCsv()
  .pipe(fs.createWriteStream('csvFiles/Inventory.csv'));

var writeStream = fs.createWriteStream('csvFiles/History.csv');

History.findAndStreamCsv()
  .pipe(writeStream);

//When the csv is created, read what's in it and parse the data
writeStream.on('finish', function() {
    //Store each history entry into a list
    var entries = [];
    //Read history from csv file that was just produced
    var readStream = fs.createReadStream('csvFiles/History.csv');
    readStream.pipe(parse({delimiter: ','}))
    .on('data', function(line) {
        entries.push(line);
    });

    readStream.on('end', function() {
        //Keep track of number of items checked in/out for each month
        //Each hashmap stores a hashmap that keeps the number of equipment used by each department
        var checkinDates = new HashMap();
        var checkoutDates = new HashMap();
        //Iterate through hashmap keys for storage
        var dateKeys, deptKeys;
        //Iterate through hashmap values for output
        var deptValues, items;
        //Parse all the data from History.csv into another csv
        var data = fs.createWriteStream('csvFiles/Data.csv');

        parseDates(entries);

        for(var i = 0; i < entries.length; i++) {
            var element = entries[i];
            var departments = new HashMap();

            if(element[3] === "checked in") {
                //If there is already a department list for a given date, obtain that list
                if(checkinDates.has(element[0]))
                    departments.copy(checkinDates.get(element[0]));

                //If a new department checks out equipment, add to the list
                if(!departments.has(element[13]))
                    items = 1;
                //Otherwise increment the number of items by 1
                else
                    items = departments.get(element[13])+1;

                //Store number of items with department as key
                departments.set(element[13], items);
                //Store departments with date as key
                checkinDates.set(element[0], departments);
            }
            else if(element[3] === "checked out") {
                if(checkoutDates.has(element[0]))
                   departments.copy(checkoutDates.get(element[0]));

                if(!departments.has(element[13]))
                    items = 1;
                else
                    items = departments.get(element[13])+1;

                departments.set(element[13], items);
                checkoutDates.set(element[0], departments);
            }
        }

        // Output to Data.csv (unfixed)
        data.write("Date, Check-Ins:\n");
        dateKeys = checkinDates.keys();
        for(var i = 0; i < dateKeys.length; i++) {
            items = 0;
            deptValues = checkinDates.get(dateKeys[i]).values();
            for(var j = 0; j < deptValues.length; j++)
                items += deptValues[i];
            data.write(dateKeys[i] + "," + items + "\n");
        }

        data.write("\nDate, Check-Outs:\n");
        dateKeys = checkoutDates.keys();
        for(var i = 0; i < dateKeys.length; i++) {
            items = 0;
            deptValues = checkoutDates.get(dateKeys[i]).values();
            for(var j = 0; j < deptValues.length; j++)
                items += deptValues[i];
            data.write(dateKeys[i] + "," + items + "\n");
        }

        data.write("\nDate, Department(s) (# of items checked in):\n");
        dateKeys = checkinDates.keys();
        for(var i = 0; i < dateKeys.length; i++) {
            deptKeys = checkinDates.get(dateKeys[i]).keys().sort();
            data.write(dateKeys[i]);
            for(var j = 0; j < deptKeys.length; j++)
                data.write("," + deptKeys[j] + "(" + checkinDates.get(dateKeys[i]).get(deptKeys[j]) + ")");
            data.write("\n");
        }

        data.write("\nDate, Department(s) (# of items checked out):\n");
        dateKeys = checkoutDates.keys();
        for(var i = 0; i < dateKeys.length; i++) {
            deptKeys = checkoutDates.get(dateKeys[i]).keys().sort();
            data.write(dateKeys[i]);
            for(var j = 0; j < deptKeys.length; j++)
                data.write("," + deptKeys[j] + "(" + checkoutDates.get(dateKeys[i]).get(deptKeys[j]) + ")");
            data.write("\n");
        }
    });
});

function parseDates(data) {
    //Parse date string into a certain format to be used later for D3 output
    var element;
    var month;
    for(var i = 0; i < data.length; i++) {
        element = data[i][0].split(" ");
        if(element.length < 9)//Skip iteration code if entry isn't valid
            continue;
        if(element[1] === "Jan")
            month = "1";
        else if(element[1] === "Feb")
            month = "2";
        else if(element[1] === "Mar")
            month = "3";
        else if(element[1] === "Apr")
            month = "4";
        else if(element[1] === "May")
            month = "5";
        else if(element[1] === "Jun")
            month = "6";
        else if(element[1] === "Jul")
            month = "7";
        else if(element[1] === "Aug")
            month = "8";
        else if(element[1] === "Sep")
            month = "9";
        else if(element[1] === "Oct")
            month = "10";
        else if(element[1] === "Nov")
            month = "11";
        else if(element[1] === "Dec")
            month = "12";
        data[i][0] = element[3].concat("-" + month);
    }
}

//sendgrid information to send autonomous emails.

var options = {
  auth: {
    api_user: 'ecs19300000',
    api_key: 'Adminadmin1@'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

//Scheduler. any inventory checked out will send an email reminder. 
cron.schedule('* * * * * *', function(){
    Inventory.find({}, function(err,inventoryforms) {
        for(var i = 0; i < inventoryforms.length; i++){
            if(inventoryforms[i].isCheckedIn == 'false' && inventoryforms[i].emailSent == 'false'){
                if((Date.now() - inventoryforms[i].dateCheckedOut) > 10000){// replace the console logs with the mail sent above.
                    inventoryforms[i].emailSent = 'true'; 
                    inventoryforms[i].save(); //please don't delete this, or it sends TONS Of emails
                    var returnDate = new Date();
                    returnDate.setDate(returnDate.getDate()+14);
                    var textMessage = '<b>' + inventoryforms[i].firstName + ' ' + inventoryforms[i].lastName + ', your item: ' + inventoryforms[i].product + ' must be returned by\n\n' + returnDate + '<b>';
                    var subjectMessage = 'Ergonomics Dept, return date reminder';
                    var email = {
                        from: 'ErgDept@ucdavis.edu',
                        to: inventoryforms[i].email,
                        subject: subjectMessage,
                        text: textMessage,
                        html: textMessage
                    };
                    var sendEmail = function(){
                        client.sendMail(email, function(err, info){
                            if (err ){
                                console.log(err);
                            }
                            else {
                                console.log('Message sent: ' + info.response);
                            }
                        });
                    };
                    sendEmail();    
                    console.log('Email sent to: ' + inventoryforms[i].email + ' with message ' + textMessage);
                
                }
            }    
        }
    });

});

module.exports = function(router) {

    // POST USER REGISTRATION ROUTE
    // Route to register new users
    // http://localhost:port/api/users
    router.post('/users', function(req,res) {
        var user = new User(); // Create new User object
        user.username = req.body.username; // Save username from request to User object
        user.password = req.body.password; // Save password from request to User object
        user.email = req.body.email; // Save email from request to User object
        user.name = req.body.name; // Save name from request to User object

        // Check if user provides all of the fields
        if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' 
            || req.body.email == null || req.body.email == '' || req.body.name === null || req.body.name === '' || req.body.repassword == null || req.body.repassword == '') {
            res.json({ success: false, message:'Ensure username, email, password, and password confirmation were provided' });
        } else if((req.body.password).localeCompare(req.body.repassword) != 0){
            res.json({ success: false, message:'The password may have been entered incorrectly.'});
        } else {
            // user provided all of the required info --> save it in the database
            user.save(function(err) {
                // if error on saving, send error message; else save user
                if(err) { 
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null) {
                        // console.log(err);
                        // console.log(err.errors);
                        // console.log(err.code);
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err }); // Display any other errors with validation
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
                } else { // Send success message back to controller/request
                    if(err)
                        {console.log(err);}
                    else
                        {res.send({ success: true, message: 'user created!' });}
                }
            });
        }
    });


    router.post('/history', function(req,res) {
        var history = new History();
        history.firstName = req.body.firstName;
        history.lastName = req.body.lastName;
        history.email = req.body.email;
        history.product = req.body.product;
        history.barcode = req.body.barcode;
        history.checkedType = req.body.checkedType;
        history.date = Date.now();
        history.description = req.body.description;
        history.save();
    });

    router.get('/history', function(req,res) {
        History.find({}, function(err,history) {
            if(err) throw err;
            res.json({ success:true, history: history});
        });
    });

    // POST USER LOGIN ROUTE
    // http://localhost:port/api/authenticate
    router.post('/authenticate', function(req,res) {
        // Search the database for username, select email,username, and password from database, then pass in a function w/ err and user
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err,user) {
            if (err) throw err; // throw err

            if(!user){ 
                // if the user doesn't exist, then send message
                res.json({ success: false, message: 'Could not authenticate user' });
            } else if (user) { // else user exists
                if(req.body.password) { 
                    // if password is provided then validate password 
                    var validPassword = user.comparePassword(req.body.password);
                } else { 
                    // no password provided
                    res.json({ success: false, message: 'No password provided'});
                }
                if (!validPassword) { 
                    // if the comparePassword return false
                    res.json({ success: false, message: 'Could not authenticate password' });
                } else { 
                    // valid user
                    // Give the JSON web token to the user with username and email info in it
                    // secret : provides extra security to the token 
                    // Token expires in 24 hr
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h'} );
                    // respond with success and token
                    res.json({ success: true, message: "User authenticated!", token: token });
                }
            }
        });
    });

    // POST INVENTORY FORM ROUTE
    // http://localhost:port/api/inventory
    router.post('/inventory', function(req,res) {
        var inventory = new Inventory();
        inventory.product = req.body.product;
        inventory.barcode = req.body.barcode;


        if(req.body.product == null || req.body.product == "" || req.body.barcode == null || req.body.barcode ==""){
            res.json({ success: false, message: 'Please enter all entries' });
        } else {
            inventory.save(function(err) {
            if(err) {
                res.json({ success: false, message: 'Barcode already exists!' });
            } else {
                res.json({ success: true, message: 'Inventory Created' });
            }
        });
        }
    });

    // GET INVENTORY FROM ROUTE
    //: http://localhost:port/api/inventory
    router.get('/inventory', function(req,res) {
        Inventory.find({}, function(err,inventoryforms) {
            if(err) throw err;
            res.json({ success:true, inventoryforms: inventoryforms});
        });
    });

    // Middleware for decrypting token and sending back to the user.
    router.use(function(req,res,next) {
        // Get the token from eiher the request, or url, or the headers
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            // verify token
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    // takes the token, combines it with the secret, verifies it, once it's good it sends it back decoded
                    req.decoded = decoded;
                    next(); // move to the next route '/me'
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

    // Router that gets the current user
    router.post('/me', function(req,res) {
        res.send(req.decoded);
    });


    // route used to obtain what permission a user has.
    router.get('/permission', function(req,res) {
        User.findOne({ username: req.decoded.username }, function(err,user) {
            if(err) throw err;
            if(!user) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    // Route to get all users for management page
    router.get('/management', function(req, res) {
        User.find({}, function(err, users) {
            if (err) throw err; // Throw error if cannot connect
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) throw err; // Throw error if cannot connect
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if user has editing/deleting privileges 
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Check if users were retrieved from database
                        if (!users) {
                            res.json({ success: false, message: 'Users not found' }); // Return error
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission }); // Return users, along with current user's permission
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return access error
                    }
                }
            });
        });
    });

    // Route to delete a user
    router.delete('/management/:username', function(req, res) {
        var deletedUser = req.params.username; // Assign the username from request parameters to a variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if current user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if curent user has admin access
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                } else {
                    // Fine the user that needs to be deleted
                    User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                        if (err) throw err; // Throw error if cannot connect
                        res.json({ success: true }); // Return success status
                    });
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/edit/:id', function(req, res) {
        var editUser = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if logged in user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if logged in user has editing privileges
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    // Find the user to be editted
                    User.findOne({ _id: editUser }, function(err, user) {
                        if (err) throw err; // Throw error if cannot connect
                        // Check if user to edit is in database
                        if (!user) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            res.json({ success: true, user: user }); // Return the user to be editted
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                }
            }
        });
    });


    router.put('/edit', function(req, res) {
        var editUser = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.name) var newName = req.body.name; // Check if a change to name was requested
        if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            if (!mainUser) {
                res.json({ success: false, message: "no user found" }); // Return erro
            } else {
                if (newName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.name = newName; // Assign new name to user in database
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
                if (newUsername) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user in database
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.username = newUsername; // Save new username to user in database
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'Username has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

                // Check if change to e-mail was requested
                if (newEmail) {
                    // Check if person making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user that needs to be editted
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if logged in user is in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                user.email = newEmail; // Assign new e-mail to user in databse
                                // Save changes
                                user.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log error to console
                                    } else {
                                        res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

                // Check if a change to permission was requested
                if (newPermission) {
                    // Check if user making changes has appropriate access
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Look for user to edit in database
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) throw err; // Throw error if cannot connect
                            // Check if user is found in database
                            if (!user) {
                                res.json({ success: false, message: 'No user found' }); // Return error
                            } else {
                                // Check if attempting to set the 'user' permission
                                if (newPermission === 'user') {
                                    // Check the current permission is an admin
                                    if (user.permission === 'admin') {
                                        // Check if user making changes has access
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error
                                        } else {
                                            user.permission = newPermission; // Assign new permission to user
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Long error to console
                                                } else {
                                                    res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission; // Assign new permission to user
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                            }
                                        });
                                    }
                                }
                                // Check if attempting to set the 'moderator' permission
                                if (newPermission === 'moderator') {
                                    // Check if the current permission is 'admin'
                                    if (user.permission === 'admin') {
                                        // Check if user making changes has access
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' }); // Return error
                                        } else {
                                            user.permission = newPermission; // Assign new permission
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Log error to console
                                                } else {
                                                    res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission; // Assign new permssion
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                            }
                                        });
                                    }
                                }

                                // Check if assigning the 'admin' permission
                                if (newPermission === 'admin') {
                                    // Check if logged in user has access
                                    if (mainUser.permission === 'admin') {
                                        user.permission = newPermission; // Assign new permission
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                            }
                                        });
                                    } else {
                                        res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' }); // Return error
                                    }
                                }
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error

                    }
                }
            }
        });
    });

    router.get('/inventoryManagement', function(req, res) {
        Inventory.find({}, function(err, inventoryforms) {
            if (err) throw err; // Throw error if cannot connect
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) throw err; // Throw error if cannot connect
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if user has editing/deleting privileges 
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Check if inventoryforms were retrieved from database
                        if (!inventoryforms) {
                            res.json({ success: false, message: 'Inventory not found' }); // Return error
                        } else {
                            res.json({ success: true, inventoryforms: inventoryforms, permission: mainUser.permission }); // Return inventory forms, along with current user's permission
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return access error
                    }
                }
            });
        });
    });


    // Route to delete an inventory item based on its barcode
    router.delete('/inventoryManagement/:barcode', function(req, res) {
        var deletedInventory = req.params.barcode; // Assign the barcode from request parameters to a variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if current user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if curent user has admin access
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                } else {
                    // Fine the user that needs to be deleted
                    Inventory.findOneAndRemove({ barcode: deletedInventory }, function(err, inventory) {
                        if (err) throw err; // Throw error if cannot connect
                        res.json({ success: true }); // Return success status
                    });
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/editInventory/:id', function(req, res) {
        var editInventory = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw error if cannot connect
            // Check if logged in user was found in database
            if (!mainUser) {
                res.json({ success: false, message: 'No user found' }); // Return error
            } else {
                // Check if logged in user has editing privileges
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    // Find the user to be editted
                    Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                        if (err) throw err; // Throw error if cannot connect
                        // Check if user to edit is in database
                        if (!inventory) {
                            res.json({ success: false, message: 'No inventory found' }); // Return error
                        } else {
                            res.json({ success: true, inventory: inventory }); // Return the user to be editted
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                }
            }
        });
    });


    router.put('/editInventory', function(req, res) {
        var editInventory = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.firstName) var newFirstName = req.body.firstName; // Check if a change to name was requested
        if (req.body.lastName) var newLastName = req.body.lastName; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.product) var newProduct = req.body.product; // Check if a change to permission was requested
        if (req.body.barcode) var newBarcode = req.body.barcode;
        if (req.body.isCheckedIn) var newIsCheckedIn = req.body.isCheckedIn;
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err; // Throw err if cannot connnect
            if (!mainUser) {
                res.json({ success: false, message: "no user found" }); // Return erro
            } else {
                if (newFirstName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!inventory) {
                                res.json({ success: false, message: 'No inventory found' }); // Return error
                            } else {
                                inventory.firstName = newFirstName; // Assign new name to user in database
                                inventory.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'First Name has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
                if (newLastName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!inventory) {
                                res.json({ success: false, message: 'No inventory found' }); // Return error
                            } else {
                                inventory.lastName = newLastName; // Assign new name to user in database
                                inventory.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Last Name has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
                if (newEmail) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!inventory) {
                                res.json({ success: false, message: 'No inventory found' }); // Return error
                            } else {
                                inventory.email = newEmail; // Assign new name to user in database
                                inventory.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Email has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
                if (newProduct) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!inventory) {
                                res.json({ success: false, message: 'No inventory found' }); // Return error
                            } else {
                                inventory.product = newProduct; // Assign new name to user in database
                                inventory.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Product has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
                if (newBarcode) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!inventory) {
                                res.json({ success: false, message: 'No inventory found' }); // Return error
                            } else {
                                inventory.barcode = newBarcode; // Assign new name to user in database
                                inventory.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'Barcode has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }
                if (newIsCheckedIn) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        Inventory.findOne({ _id: editInventory }, function(err, inventory) {
                            if (err) throw err; // Throw error if cannot connect
                            if (!inventory) {
                                res.json({ success: false, message: 'No inventory found' }); // Return error
                            } else {
                                inventory.isCheckedIn = newIsCheckedIn; // Assign new name to user in database
                                inventory.save(function(err) {
                                    if (err) {
                                        console.log(err); // Log any errors to the console
                                    } else {
                                        res.json({ success: true, message: 'is Checked In has been updated!' }); // Return success message
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    }
                }

            }
        });
    });

    router.get('/getInventoryIdBasedOnBarcode/:barcode', function(req, res) {
        var editInventory = req.params.barcode;
        Inventory.findOne({ barcode: editInventory }, function(err, inventory) {
            if (!inventory) {
                res.json({ success: false, message: 'No inventory found' });
            } else {
                res.json({ success: true, inventory: inventory });
            }
        });
    });

    router.get('/getInventoryBasedOnId/:id', function(req, res) {
        var editInventory = req.params.id; // Assign the _id from parameters to variable
        Inventory.findOne({ _id: editInventory}, function (err, inventory) {
            res.json({ inventory: inventory});
        });
        
    });


    router.put('/checkOutUpdate', function(req, res) {
        var editInventory = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.firstName) var newFirstName = req.body.firstName; // Check if a change to name was requested
        if (req.body.lastName) var newLastName = req.body.lastName; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.phoneNumber) var newPhoneNumber = req.body.phoneNumber;
        if (req.body.supervisorFirstName) var newSupervisorFirstName = req.body.supervisorFirstName;
        if (req.body.supervisorLastName) var newSupervisorLastName = req.body.supervisorLastName;
        if (req.body.supervisorPhoneNumber) var newSupervisorPhoneNumber = req.body.supervisorPhoneNumber;
        if (req.body.supervisorEmail) var newSupervisorEmail = req.body.supervisorEmail;
        if (req.body.title) var newTitle = req.body.title;
        if (req.body.department) var newDepartment = req.body.department;
        if (req.body.location) var newLocation = req.body.location;
        if (req.body.chargeNumber) var newChargeNumber = req.body.chargeNumber;
        if (req.body.product) var newProduct = req.body.product; // Check if a change to permission was requested
        if (req.body.barcode) var newBarcode = req.body.barcode;
        if (req.body.isCheckedIn) var newIsCheckedIn = req.body.isCheckedIn; 
        if (req.body.dateCheckedOut) var newDateCheckedOut = req.body.dateCheckedOut;  
        if (newFirstName) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.firstName = newFirstName;
                inventory.save();
            });
        }
        if (newLastName) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.lastName = newLastName;
                inventory.save();
            });
        }
        if (newEmail) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.email = newEmail;
                inventory.save();
            });
        }
        if (newPhoneNumber) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.phoneNumber = newPhoneNumber;
                inventory.save();
            });
        }
        if (newSupervisorFirstName) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.supervisorFirstName = newSupervisorFirstName;
                inventory.save();
            });
        }
        if (newSupervisorLastName) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.supervisorLastName = newSupervisorLastName;
                inventory.save();
            });
        }
        if (newSupervisorEmail) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.supervisorEmail = newSupervisorEmail;
                inventory.save();
            });
        }

        if (newSupervisorPhoneNumber) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.supervisorPhoneNumber = newSupervisorPhoneNumber;
                inventory.save();
            });
        }
        if (newTitle) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.title = newTitle;
                inventory.save();
            });
        }
        if (newDepartment) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.department = newDepartment;
                inventory.save();
            });
        }
        if (newLocation) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.location = newLocation;
                inventory.save();
            });
        }
        if (newChargeNumber) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.chargeNumber = newChargeNumber;
                inventory.save();
            });
        }

        if (newIsCheckedIn) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.isCheckedIn = newIsCheckedIn;
                inventory.save();
            });
        }
        if (newDateCheckedOut) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.dateCheckedOut = newDateCheckedOut;
                inventory.save();
            });
        }
    });


    router.put('/checkInUpdate', function(req, res) {
        var editInventory = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.firstName) var newFirstName = req.body.firstName; // Check if a change to name was requested
        if (req.body.lastName) var newLastName = req.body.lastName; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.product) var newProduct = req.body.product; // Check if a change to permission was requested
        if (req.body.barcode) var newBarcode = req.body.barcode;
        if (req.body.isCheckedIn) var newIsCheckedIn = req.body.isCheckedIn; 
        if (req.body.dateCheckedIn) var newDateCheckedIn = req.body.dateCheckedIn;  
        if (newFirstName) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.firstName = newFirstName;
                inventory.save();
            });
        }
        if (newLastName) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.lastName = newLastName;
                inventory.save();
            });
        }
        if (newEmail) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.email = newEmail;
                inventory.save();
            });
        }
        if (newIsCheckedIn) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.isCheckedIn = newIsCheckedIn;
                inventory.save();
            });
        }
        if (newDateCheckedIn) {
            Inventory.findOne({ _id: editInventory}, function(err, inventory) {
                inventory.dateCheckedIn = newDateCheckedIn;
                inventory.save();
            });
        }
    });

    // return router to server
    return router;
}