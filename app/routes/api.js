var User = require('../models/user');
var Inventory = require('../models/inventory')
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
var cron = require('node-cron');

/*
scheduler = function(barcode){
    cron.schedule('* * * * * *', function(barcode){
        Inventory.findOne({ barcode: barcode }).select('isCheckedIn').exec(function(err,inventory) {
            if(err) throw err;
                    console.log(inventory.isCheckedIn);
        }); 
    });
}
*/
module.exports = function(router) {
	// POST USER REGISTRATION ROUTE
	// http://localhost:port/api/users


	router.post('/users', function(req,res) {
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
 		user.name = req.body.name; // Save name from request to User object

		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name === null || req.body.name === '') {
			res.json({ success: false, message:'Ensure username, email, and password were provided' });
		} else {
			user.save(function(err) {
				if(err) { 
					res.json({ success: false, message: 'Username or Email already exists!' });
				} else {
					res.send({ success: true, message: 'user created!' });
				}
			});
		}
	});

	// POST USER LOGIN ROUTE
	// http://localhost:port/api/authenticate
	router.post('/authenticate', function(req,res) {
		User.findOne({ username: req.body.username }).select('email username password').exec(function(err,user) {
			if (err) throw err;

			if(!user){
				res.json({ success: false, message: 'Could not authenticate user' });
			} else if (user) {
				if(req.body.password) {
					var validPassword = user.comparePassword(req.body.password);
				} else {
					res.json({ success: false, message: 'No password provided'});
				}
				if (!validPassword) {
					res.json({ success: false, message: 'Could not authenticate password' });
				} else {
					var token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h'} );
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
		//scheduler that fires every second.
        //scheduler(inventory.barcode);

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

	// decrypting token and sending back to the user.
	router.use(function(req,res,next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if(token) {
			// verify token
			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.json({ success: false, message: 'Token invalid' });
				} else {
					// takes the token, combines it with the secret, verifies it, once it's good it sends it back decoded
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.json({ success: false, message: 'No token provided' });
		}
	});

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

        Inventory.findOne({ barcode: req.params.barcode }, function(err, inventory) {
            res.json({ inventory: inventory });
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
        if (req.body.product) var newProduct = req.body.product; // Check if a change to permission was requested
        if (req.body.barcode) var newBarcode = req.body.barcode;
        if (req.body.isCheckedIn) var newIsCheckedIn = req.body.isCheckedIn;   
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
    });



	return router;
}