import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { UserCardProps } from '../models/UserCardProps';

const UserCard: React.FC<UserCardProps> = ({ user }) => {
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
