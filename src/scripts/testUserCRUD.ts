import sequelize from '../../config/database';
import User from '../models/User';
import bcrypt from 'bcryptjs'; // We might need this if we create a user with a password

const runUserCRUDTests = async () => {
  try {
    await sequelize.authenticate(); // Ensure connection
    console.log('Database connection established for CRUD tests.');

    // --- CREATE ---
    console.log('\n--- Testing CREATE ---');
    const saltRounds = 10;
    const testPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds);

    const newUser = await User.create({
      email: `testuser-${Date.now()}@example.com`, // Unique email for each run
      passwordHash: hashedPassword,
      role: 'shopper',
    });
    console.log('Created User:', newUser.toJSON());
    const userId = newUser.id;

    // --- READ ---
    console.log('\n--- Testing READ ---');
    // Find by Primary Key
    const foundUserById = await User.findByPk(userId);
    if (foundUserById) {
      console.log('Found User by ID:', foundUserById.toJSON());
    } else {
      console.log('User not found by ID:', userId);
    }

    // Find one by attribute
    const foundUserByEmail = await User.findOne({
      where: { email: newUser.email },
    });
    if (foundUserByEmail) {
      console.log('Found User by Email:', foundUserByEmail.toJSON());
    } else {
      console.log('User not found by email:', newUser.email);
    }

    // Find all users (limit for brevity in logs)
    const allUsers = await User.findAll({ limit: 5 });
    console.log(
      'Found All Users (limit 5):',
      allUsers.map((u) => u.toJSON())
    );

    // --- UPDATE ---
    console.log('\n--- Testing UPDATE ---');
    if (foundUserById) {
      foundUserById.role = 'admin'; // Change role from shopper to admin
      await foundUserById.save(); // Save the changes
      console.log('Updated User:', foundUserById.toJSON());

      // Verify update
      const updatedUserVerify = await User.findByPk(userId);
      if (updatedUserVerify) {
        console.log(
          'Verified Updated User (role should be admin):',
          updatedUserVerify.toJSON()
        );
      }
    } else {
      console.log('Skipping UPDATE test as user for update was not found.');
    }

    // --- DELETE ---
    console.log('\n--- Testing DELETE ---');
    if (foundUserById) {
      await foundUserById.destroy(); // Delete the user
      console.log(`User with ID ${userId} deleted.`);

      // Verify deletion
      const deletedUserVerify = await User.findByPk(userId);
      if (!deletedUserVerify) {
        console.log(`Verified: User with ID ${userId} no longer exists.`);
      } else {
        console.error(
          `Error: User with ID ${userId} still exists after deletion attempt.`
        );
      }
    } else {
      console.log('Skipping DELETE test as user for delete was not found.');
    }
  } catch (error) {
    console.error('Error during CRUD tests:', error);
  } finally {
    await sequelize.close();
    console.log('\nDatabase connection closed after CRUD tests.');
  }
};

runUserCRUDTests();
