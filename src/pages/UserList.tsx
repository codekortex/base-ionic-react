import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    IonFab,
    IonFabButton,
    IonSkeletonText,
    IonAlert,
} from '@ionic/react';
import { add, create, trash } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchUsers, deleteUser, clearError } from '../store/slices/userSlice';
import { selectAllUsers, selectUsersError, selectUsersLoading } from '../store/selectors/userSelectors';
import UserForm from './UserForm';

const UserList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector(selectAllUsers);
    const loading = useSelector(selectUsersLoading);
    const error = useSelector(selectUsersError);

    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleRefresh = (event: CustomEvent) => {
        dispatch(fetchUsers())
            .finally(() => event.detail.complete());
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    const handleDelete = () => {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete));
            setUserToDelete(null);
            setShowDeleteAlert(false);
        }
    };

    const confirmDelete = (userId: number) => {
        setUserToDelete(userId);
        setShowDeleteAlert(true);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Users</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent />
                </IonRefresher>

                {loading ? (
                    <IonList>
                        {[...Array(3)].map((_, i) => (
                            <IonItem key={i}>
                                <IonLabel>
                                    <IonSkeletonText animated style={{ width: '80%' }} />
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                ) : (
                    <IonList>
                        {users.map((user) => (
                            <IonItem key={user.id}>
                                <IonLabel>
                                    <h2>{user.name}</h2>
                                    <p>{user.email}</p>
                                </IonLabel>
                                <IonButtons slot="end">
                                    <IonButton onClick={() => handleEdit(user)}>
                                        <IonIcon icon={create} slot="icon-only" />
                                    </IonButton>
                                    <IonButton onClick={() => confirmDelete(user.id)}>
                                        <IonIcon icon={trash} slot="icon-only" />
                                    </IonButton>
                                </IonButtons>
                            </IonItem>
                        ))}
                    </IonList>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowForm(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <UserForm
                    isOpen={showForm}
                    user={selectedUser}
                    onDidDismiss={() => {
                        setShowForm(false);
                        setSelectedUser(null);
                    }}
                />

                <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header="Confirm Delete"
                    message="Are you sure you want to delete this user?"
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        },
                        {
                            text: 'Delete',
                            role: 'destructive',
                            handler: handleDelete,
                        },
                    ]}
                />

                <IonToast
                    isOpen={!!error}
                    message={error || ''}
                    duration={3000}
                    onDidDismiss={() => dispatch(clearError())}
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default UserList;