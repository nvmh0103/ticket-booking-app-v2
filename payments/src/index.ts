import './db/mongoose';
import './nats-connect/nats'
import { app } from './app'


app.listen(3000, () => {
    console.log("Listening on port 3000!");
})