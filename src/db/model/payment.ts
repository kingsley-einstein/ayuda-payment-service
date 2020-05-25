import { model, Schema, Model, Document } from "mongoose";

// const PaymentSchema = new Schema({
//   amount: Number,
//   reference: String,
//   dueDate: {
//     type: Date,
//     required: false,
//     default: null
//   }
// }, {
//   timestamps: true
// });

// const Payment = model("PaymentReference", PaymentSchema);

export class Payment {
  PaymentSchema: Schema<any>;
  PaymentModel: Model<Document, {}>

  constructor() {
    this.configure();
  }

  configure() {
    this.PaymentSchema = new Schema({
      amount: Number,
      reference: {
        type: String,
        unique: true
      },
      paid: {
        type: Boolean,
        default: false
      },
      dueDate: {
        type: Date,
        required: false,
        default: null
      }
    },
    {
      timestamps: true
    });
    this.PaymentModel = model("PaymentReference", this.PaymentSchema);
  }

  getModel() {
    return this.PaymentModel;
  }

  create(body: any) {
    return this.PaymentModel.create(body);
  }

  findByReference(reference: string) {
    return this.PaymentModel.findOne({ reference });
  }

  findById(id: any) {
    return this.PaymentModel.findById(id);
  }

  updateByReference(reference: string, update: any) {
    return this.PaymentModel.findOneAndUpdate({ reference }, update, { new: true });
  }

  deleteByReference(reference: string) {
    return this.PaymentModel.findOneAndDelete({ reference });
  }
}
