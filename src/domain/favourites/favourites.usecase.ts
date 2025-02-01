import FavouriteModel from '@/data-access/models/favourites.schema';
import mongoose from 'mongoose';


export const addFavourite = async (userId: string, advertismentId: string) => {
  const existingFavourite = await FavouriteModel.findOne({ userId, advertismentId });

  if (existingFavourite) {
    throw { status: 400, message: 'Advertisement is already in favourites!' };
  }

  return FavouriteModel.create({ userId, advertismentId: new mongoose.Types.ObjectId(advertismentId) });
};


export const removeFavourite = async (userId: string, advertismentId: string) => {
  const existingFavourite = await FavouriteModel.findOne({ userId, advertismentId });

  if (!existingFavourite) {
    throw { status: 400, message: 'Advertisement is not in favourites!' };
  }

  return FavouriteModel.findOneAndDelete({ userId, advertismentId });
};

export const getUserFavourites = (userId: string) => 
  FavouriteModel.find({ userId }).populate('advertismentId');
