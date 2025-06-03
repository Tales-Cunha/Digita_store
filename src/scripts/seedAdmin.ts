import sequelize from '../../config/database';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established for seeding.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SecureAdminP@ssw@ord!';

    if (!adminEmail || !adminPassword) {
      console.error(
        'ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables or defaults.'
      );
      process.exit(1);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    // Use findOrCreate to avoid creating duplicate admin users
    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'admin', // As per PRD role enum [cite: 9]
      },
    });

    if (created) {
      console.log(
        `Admin user "${user.email}" created successfully with ID: ${user.id}`
      );
    } else {
      console.log(`Admin user "${user.email}" already exists.`);
      // Optionally, you could update the existing admin user here if needed
      // For example, update password if it has changed:
      // if (!await bcrypt.compare(adminPassword, user.passwordHash)) {
      //   user.passwordHash = hashedPassword;
      //   await user.save();
      //   console.log(`Admin user "${user.email}" password updated.`);
      // }
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1); // Exit with an error code
  } finally {
    await sequelize.close();
    console.log('Database connection closed after seeding.');
  }
};

seedAdminUser();
