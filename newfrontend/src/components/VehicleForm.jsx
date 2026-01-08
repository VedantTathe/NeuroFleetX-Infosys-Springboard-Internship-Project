import React, { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const VehicleForm = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    licensePlate: vehicle?.licensePlate || '',
    type: vehicle?.type || 'SEDAN',
    passengerCapacity: vehicle?.passengerCapacity || 4,
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    basePricePerKm: vehicle?.basePricePerKm || 2.5,
    isAvailable: vehicle?.isAvailable !== undefined ? vehicle.isAvailable : true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.make.trim()) {
      newErrors.make = 'Vehicle make is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required';
    }
    
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }
    
    if (formData.passengerCapacity < 1 || formData.passengerCapacity > 8) {
      newErrors.passengerCapacity = 'Passenger capacity must be between 1 and 8';
    }
    
    if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Invalid year';
    }
    
    if (formData.basePricePerKm <= 0) {
      newErrors.basePricePerKm = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.make ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Toyota, Honda, etc."
              />
              {errors.make && (
                <p className="text-red-500 text-xs mt-1">{errors.make}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.model ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Camry, Civic, etc."
              />
              {errors.model && (
                <p className="text-red-500 text-xs mt-1">{errors.model}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Plate *
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.licensePlate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC-123"
              />
              {errors.licensePlate && (
                <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="EV">Electric Vehicle</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passenger Capacity *
              </label>
              <input
                type="number"
                name="passengerCapacity"
                value={formData.passengerCapacity}
                onChange={handleChange}
                min="1"
                max="8"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.passengerCapacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.passengerCapacity && (
                <p className="text-red-500 text-xs mt-1">{errors.passengerCapacity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear() + 1}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Blue, Red, etc."
              />
              {errors.color && (
                <p className="text-red-500 text-xs mt-1">{errors.color}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price per Km *
              </label>
              <input
                type="number"
                name="basePricePerKm"
                value={formData.basePricePerKm}
                onChange={handleChange}
                step="0.1"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.basePricePerKm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2.5"
              />
              {errors.basePricePerKm && (
                <p className="text-red-500 text-xs mt-1">{errors.basePricePerKm}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Available for Booking</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaSave className="mr-2" />
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
