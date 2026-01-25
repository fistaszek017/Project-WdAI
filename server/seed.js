const sequelize = require("./models");
const User = require("./models/users");
const bcrypt = require("bcrypt");

const users = [
    { email: "admin@example.com", password: "adminPassword123", role: "admin", name: "Admin" },
    { email: "staszek.w@example.com", password: "staszekwPassword123", role: "user", name: "Staszek W" },
    { email: "staszek.o@example.com", password: "staszekoPassword123", role: "user", name: "Staszek O" },
    { email: "kacper@example.com", password: "kacperPassword123", role: "user", name: "Kacper" },
    { email: "prowadzacy@example.com", password: "prowadzacyPassword123", role: "user", name: "Prowadzący" }
];

async function seed() {
    try {
        await sequelize.sync({ alter: true }); // Update schema if needed
        console.log("Database synced.");

        for (const u of users) {
            const existing = await User.findOne({ where: { email: u.email } });
            if (!existing) {
                const passwordHash = await bcrypt.hash(u.password, 10);
                await User.create({
                    email: u.email,
                    passwordHash,
                    role: u.role
                });
                console.log(`User created: ${u.email} (${u.role})`);
            } else {
                console.log(`User already exists: ${u.email}`);
                // Update role if needed (e.g. if we just added the column and they existed before without it)
                if (existing.role !== u.role) {
                    existing.role = u.role;
                    await existing.save();
                    console.log(`Updated role for ${u.email} to ${u.role}`);
                }
            }
        }

        console.log("\n--- Credentials ---");
        users.forEach(u => {
            console.log(`${u.name}: ${u.email} / ${u.password}`);
        });

    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        await sequelize.close();
    }
}

seed();
