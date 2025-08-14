import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignFee } from '../../redux/slices/feeSlice';
import { fetchParents } from '../../redux/slices/parentSlice';
import { fetchVillages } from '../../redux/slices/villageSlice';

const AssignFee = () => {
  const dispatch = useDispatch();
  const parents = useSelector((state) => state.parents?.parents || []);


  const { list: villages = [] } = useSelector((state) => state.village);

  const [formData, setFormData] = useState({
    villageId: '',
    parentId: '',
    totalAmount: '',
    openingBalance: '',
    installments: [{ dueDate: '', amount: '' }],
  });

  useEffect(() => {
    dispatch(fetchParents());
    dispatch(fetchVillages());
  }, [dispatch]);

  const handleVillageChange = (e) => {
    const selectedVillageId = e.target.value;
    setFormData({ ...formData, villageId: selectedVillageId, parentId: '' });
  };

  const handleInstallmentChange = (index, field, value) => {
    const updatedInstallments = [...formData.installments];
    updatedInstallments[index][field] = value;
    setFormData({ ...formData, installments: updatedInstallments });
  };

  const addInstallment = () => {
    setFormData({
      ...formData,
      installments: [...formData.installments, { dueDate: '', amount: '' }],
    });
  };

  const removeInstallment = (index) => {
    const updatedInstallments = formData.installments.filter((_, i) => i !== index);
    setFormData({ ...formData, installments: updatedInstallments });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assignFee(formData));
  };
console.log(parents.map((p) => p.villageId));
const filteredParents = parents.filter(
  (p) => p.villageId?._id?.toString() === formData.villageId?.toString()
);

console.log(filteredParents);
  return (
    <div className="container mt-4">
      <h4 className="mb-4">Assign Fee to Parent</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Village</label>
            <select
              className="form-control"
              value={formData.villageId}
              onChange={handleVillageChange}
              required
            >
              <option value="">-- Select Village --</option>
              {villages?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.villageName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Parent</label>
            <select
              className="form-control"
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              required
            >
              <option value="">-- Select Parent --</option>
              {filteredParents.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.fullName} ({p.mobile})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Total Amount</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter total fee"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Opening Balance</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter previous due"
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label>Installments</label>
            {formData.installments.map((installment, index) => (
              <div key={index} className="row mb-2">
                <div className="col-md-5">
                  <input
                    type="date"
                    className="form-control"
                    value={installment.dueDate}
                    onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={installment.amount}
                    onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeInstallment(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addInstallment}>
              Add Installment
            </button>
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-success">
              Assign Fee
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssignFee;
