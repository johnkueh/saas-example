import cloudinary from 'cloudinary';

export default {
  Mutation: {
    deleteLogo(parent, { assetId }, { user, prisma }, info) {
      cloudinary.uploader.destroy(assetId);
      return prisma.deleteLogo({ assetId });
    }
  }
};
