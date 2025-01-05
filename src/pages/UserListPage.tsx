import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonSpinner, IonAlert } from '@ionic/react';
import { RootState, AppDispatch } from '../store';
import { useHistory } from 'react-router-dom';
import { selectAllUsers, selectUsersError, selectUsersLoading } from '../store/selectors/userSelectors';
import { deleteUser, fetchUsers } from '../store/slices/userSlice';
import { UserModelView } from '../components/models/UserModelView';
import UserCard from '../components/ui/UserCard';

const UserListPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const users = useSelector((state: RootState) => selectAllUsers(state));
    const loading = useSelector((state: RootState) => selectUsersLoading(state));
    const error = useSelector((state: RootState) => selectUsersError(state));
    const history = useHistory();

    const [showAlert, setShowAlert] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = (id: number) => {
        setSelectedUserId(id);
        setShowAlert(true);
    };

    const confirmDelete = () => {
        if (selectedUserId !== null) {
            dispatch(deleteUser(selectedUserId));
        }
        setShowAlert(false);
        setSelectedUserId(null);
    };

    const cancelDelete = () => {
        setShowAlert(false);
        setSelectedUserId(null);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Usuarios</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {loading && <IonSpinner name="crescent" />}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <IonList>
                    {users.map((user: UserModelView) => (
                        <IonItem key={user.id}>
                            <UserCard user={user} />
                            <IonButton color="danger" onClick={() => handleDelete(user.id)}>
                                Eliminar
                            </IonButton>
                            <IonButton color="secondary" onClick={() => history.push(`/edit-user/${user.id}`)}>
                                Editar
                            </IonButton>
                        </IonItem>
                    ))}
                </IonList>
                <IonButton expand="full" onClick={() => history.push('/add-user')}>
                    Agregar Usuario
                </IonButton>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={cancelDelete}
                    header={'Confirmar'}
                    message={'¿Estás seguro de eliminar este usuario?'}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                        },
                        {
                            text: 'Eliminar',
                            handler: confirmDelete,
                        },
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default UserListPage;
