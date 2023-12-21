import { editLandlord } from "../graphql/Mutations";
import ApartmentCard from './ApartmentCard';

const LandlordDetails = () => {
    const [isEditModalVisible, setEditModalVisibility] = useState(false);
    const [isAddModalVisible, setAddModalVisibility] = useState(false);
    const {userData, accountType} = useContext(UserContext);
    const [updateLandlord, {loading, error}] = useMutation(editLandlord());
    const [addApartmentCall] = useMutation(createApartment());
    const showEditModal = () => {
        setEditModalVisibility(true);
    }

    const hideEditModal = () => {
        setEditModalVisibility(false);
    }

    const showAddModal = () => {
        setAddModalVisibility(true);
    }

    const hideAddModal = () => {
        setAddModalVisibility(false);
    }

    const updateLandlordInfo = (formData) => {
        formData.id = userData.id;
        console.log(JSON.stringify(formData));
        try{
            updateLandlord({variables: formData});
        } catch(e){
            console.log(e);
        }
    }

    const addApartment = (formData) => {
        formData.landlordId = userData.id;
        if(formData.amenities){
            formData.amenities = formData.amenities.split(",");
        }
        if(formData.price){
            formData.price = Number(formData.price)
        }
        try{
            addApartmentCall({ variables: formData });
        }catch(e){
            console.log(e);
        }
    }

    ownedApartments =
        userData &&
        userData.ownedApartments.map((apartment) => {
            return <ApartmentCard apartment={apartment} inBookmark={false} key={apartment.id} />;});

    return (
        <div className="card">
            <div className="user">
              <h2>Landlord Details</h2>
              <h3>{userData.name}</h3>
              <p>Contact email: {userData.contactInfo}</p>
            </div>
        </div>
    )

}

export default LandlordDetails;