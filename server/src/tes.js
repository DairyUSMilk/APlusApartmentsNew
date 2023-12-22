import { approveApartmentById, getAllApartments } from "./data/apartments.js";

const main = async() => {
    const apartments = await getAllApartments();
    for(let i = 0; i < apartments.length; i++){
        await approveApartmentById(apartments[i]._id);
    }
}
main();
