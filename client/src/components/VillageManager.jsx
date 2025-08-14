import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVillages,
  addVillage,
  updateVillage,
  deleteVillage
} from '../redux/slices/villageSlice';

const VillageManager = () => {
  const [villageName, setVillageName] = useState('');
  const [editId, setEditId] = useState(null);
  const dispatch = useDispatch();

  const { list: villages, loading, error } = useSelector((state) => state.village);

  useEffect(() => {
    dispatch(fetchVillages());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateVillage({ id: editId, villageName }));
    } else {
      dispatch(addVillage(villageName));
    }
    setVillageName('');
    setEditId(null);
  };

  const handleEdit = (village) => {
    setVillageName(village.villageName);
    setEditId(village._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this village?')) {
      dispatch(deleteVillage(id));
    }
  };

  return (
    <div className="container mt-4 col-md-7">
      <h4>Village Manager (Redux)</h4>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label>Village Name</label>
          <input
            type="text"
            className="form-control"
            value={villageName}
            onChange={(e) => setVillageName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success me-2">
          {editId ? 'Update' : 'Add'} Village
        </button>
        {editId && (
          <button className="btn btn-secondary" onClick={() => { setVillageName(''); setEditId(null); }}>
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading villages...</p>}
      {error && <p className="text-danger">{error}</p>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Village Name</th>
            <th>Village Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {villages.map((v) => (
            <tr key={v._id}>
              <td>{v.villageName}</td>
              <td>{v.villageCode}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(v)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VillageManager;
