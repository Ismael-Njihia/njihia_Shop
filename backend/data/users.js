import bcrypt from 'bcryptjs';


const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 5),
        isAdmin: true,
    },
    {
        name: 'ishmael Njihia',
        email: 'ishmael@gmail.com',
        password: bcrypt.hashSync('123456', 5),
        isAdmin: false,
    },
    {
        name: ' John doe',
        email: 'john@gmail.com',
        password: bcrypt.hashSync('123456', 5),
        isAdmin: false,
    }
]

export default users;