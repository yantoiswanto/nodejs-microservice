import expressApp from "./expressApp";

const PORT = process.env.PORT || 8000;

export const StartServer = async () => {

    expressApp.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    process.on("uncaughtException", async (error) => {
        console.log(error);
        process.exit(1);
    });


}

StartServer().then(() => {
    console.log("Server is up and running");
});
