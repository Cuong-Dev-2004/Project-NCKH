const router = express.Router();
import { createBooking } from "../Controllers/bookingController";


router.post("/create-booking", createBooking);

export default router;