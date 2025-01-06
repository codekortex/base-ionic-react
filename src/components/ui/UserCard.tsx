import React, { useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { UserCardProps } from '../models/UserCardProps';
import { fetchUserById } from '../../store/slices/userSlice';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const dispatch: AppDispatch = useDispatch();
    const userId = user.id;
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
    }, [userId, dispatch]);

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>{user.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>{user.email}</p>
            </IonCardContent>
        </IonCard>
    );
};

export default UserCard;
